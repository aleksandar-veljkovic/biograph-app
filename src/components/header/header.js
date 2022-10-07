import { ExitToApp, FileOpenOutlined, FolderOutlined, HelpOutline, SaveOutlined, StarOutline } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { useState, useContext, createRef } from "react";
import { FileUploader } from "react-drag-drop-files";
import { GraphContext } from "../../contexts/graph-context";
import { QueryContext } from "../../contexts/query-context";
import { Modal } from "../modal/modal";

export const Header = () => {
    const [pageContext, setPageContext] = useState('query');
    const { results, singleNode, getNode, currentQuery, resultsToCsv, rawQuery, exampleQueries } = useContext(QueryContext);
    const { loadFromQuery, clearGraph } = useContext(GraphContext);
    const [isLoadVisible, setIsLoadVisible] = useState(false);
    const [isExamplesVisible, setIsExamplesVisible] = useState(false);

    const queryRef = createRef();

    const handleChange = (file) => {
        console.log(file);
        const reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (e) => {
            console.log(queryRef);
            queryRef.current.value = e.target.result;
        };

        // Read in the image 
        reader.readAsText(file);
      };

    const loadQuery = () => {
        const query = queryRef.current.value;
        rawQuery.current = query;
        const res = loadFromQuery(query);

        if (res) {
            setIsLoadVisible(false);
        } else {
            alert('Invalid query!');
        }
    }
    
    return (
        <header className="header">            
            { isLoadVisible &&
                <Modal 
                    onClose={() => setIsLoadVisible(false)}
                    title="Load Query"
                >
                    <div className="load-query-body">
                        <TextField disabled inputRef={queryRef} className="query-input" multiline rows={4} placeholder="Load query file bellow"/>
                        <FileUploader handleChange={handleChange} label="Click here or drag and drop query file" name="file" types={['JSON']} />
                        <br/>
                        <Button variant="contained" onClick={() => loadQuery()}>Load</Button>
                    </div>
                </Modal>
            }

            { isExamplesVisible &&
                <Modal 
                    onClose={() => setIsExamplesVisible(false)}
                    title="Examples"
                >
                    <div className="load-query-body">
                        <p>Select example query to load</p>
                        {
                            exampleQueries.map((q, index) => (
                                <div key={`example-${index}`} className="query-item" onClick={() => { loadFromQuery(JSON.stringify(q.query)); setIsExamplesVisible(false) }}>
                                    <span>{ q.title }</span>
                                </div>
                            ))
                        }
                    </div>
                </Modal>
            }

            <div className="header-left">
                <span className="logo">BioGraph</span>

                <div className="header-items">
                    <a className="header-item" href="#" onClick={() => setIsExamplesVisible(true)}>
                        <StarOutline/>
                        Examples
                    </a>

                    <a className="header-item" href="#" onClick={() => setIsLoadVisible(true)}>
                        <FolderOutlined/>
                        Load Query
                    </a>

                    <a className="header-item" href={URL.createObjectURL(new Blob([rawQuery.current], {type : 'application/json'}))} download={'query.json'}>
                        <SaveOutlined/>
                        Save Query
                    </a>

                    <a className="header-item" href="#" onClick={() => clearGraph()}>
                        <FileOpenOutlined/>
                        New Query
                    </a>

                    { results != null && 
                    <a className="header-item" href={URL.createObjectURL(new Blob([resultsToCsv()], {type : 'text/csv'}))} download={'results.csv'}>
                        <ExitToApp/>
                        Export to CSV
                    </a>
                    }
                </div>
            </div>
            <div className="header-right">
                <a className="header-item" href="#">
                    <HelpOutline/>
                    Help
                </a>
            </div>
       </header>
    )
}