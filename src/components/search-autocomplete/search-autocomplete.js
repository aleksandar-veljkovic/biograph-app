import { Search } from "@mui/icons-material";
import { createRef, useContext, useRef, useState } from "react"
import { QueryContext } from "../../contexts/query-context";
import { IconInput } from "../icon-input/icon-input";
import axios from "axios";

export const SearchAutocomplete = ({ onSelected, entityType, ...props }) => {
    const { runSearch } = useContext(QueryContext);
    const searchInputRef = createRef();

    const [results, setResults] = useState(null);

    const [resultsVisible, setResultsVisible] = useState(false);
    const [isBusy, setIsBusy] = useState(false);
    const query = useRef(null);
    const searchCancelToken = useRef();

    const handleQuery = (queryString) => {
        console.log(queryString);
        if (queryString.length == 0) {
            query.current = null;
            setResultsVisible(false);
            // setResults(null);
        } else {
            setIsBusy(true);
            query.current = queryString;

            if (searchCancelToken.current != null) {
                searchCancelToken.current.cancel('New search triggered');
            }

            searchCancelToken.current = axios.CancelToken.source();

            runSearch(queryString, entityType, searchCancelToken.current.token).then((res) => {
                console.log(res);
                setResults(res)
            }).catch(err => { console.log(err) }).finally(() => setIsBusy(false))
            setResultsVisible(true);
        }
    }

    return (
        <div className="search-autocomplete"
        >
            <IconInput
                debounceTimeout={400}
                minLength={2}
                className="search-input nodrag"
                type="text"
                inputRef={searchInputRef}
                placeholder="Search by names, identifiers, keywords..."
                icon={<Search />}
                {...props}
                onFocus={() => {
                    if (query.current != null && query.current.trim().length > 0) {
                        setResultsVisible(true)
                    }
                }}
                onChange={(e) => handleQuery(e.target.value.trim())}
            />

            {
                resultsVisible &&
                <div className="search-results nodrag">
                    {
                        isBusy ?
                            <p className="loading">Loading</p>
                            :
                            results != null && results.byIdentifier.length > 0 &&
                            <div className="result-group">
                                <label>
                                    Matched by identifiers
                                </label>
                                {
                                    results.byIdentifier.map(result => (
                                        <div className="search-result-item" onClick={() => {
                                            searchInputRef.current.value = null;
                                            query.current = null;
                                            onSelected(result.primaryId)
                                            setResultsVisible(false);
                                        }}>
                                            <p className="primary-id">{result.primaryId} </p>
                                            <p className="identifiers">{result.identifiers.join(', ')}</p>
                                        </div>
                                    ))
                                }
                            </div>
                    }

                    {
                        results != null && results.byKeyword.length > 0 &&
                        <div className="result-group">
                            <label>
                                Matched by keywords
                            </label>
                            {

                                results.byKeyword.map(result => (
                                    <div className="search-result-item" onClick={() => {
                                        searchInputRef.current.value = null;
                                        query.current = null;
                                        onSelected(result.primaryId)
                                        setResultsVisible(false);
                                    }}>
                                        <p className="primary-id">{result.primaryId} </p>
                                        <p className="keywords">{result.keywords.join(', ')}</p>
                                    </div>
                                ))
                            }
                        </div>
                    }

                    {
                        !isBusy && (results == null || (results.byIdentifier.length == 0 && results.byKeyword.length == 0)) &&
                        <p className="no-results">No results found</p>
                    }
                </div>
            }
        </div>
    )
}