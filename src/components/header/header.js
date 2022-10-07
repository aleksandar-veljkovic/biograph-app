import { ExitToApp, FileOpenOutlined, FolderOutlined, HelpOutline, SaveOutlined, StarOutline } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { useState, useContext, createRef } from "react";
import { FileUploader } from "react-drag-drop-files";
import { GraphContext } from "../../contexts/graph-context";
import { QueryContext } from "../../contexts/query-context";
import { BioAccordion } from "../accordion/bio-accordion";
import { Modal } from "../modal/modal";

export const Header = () => {
    const [pageContext, setPageContext] = useState('query');
    const { results, singleNode, getNode, currentQuery, resultsToCsv, rawQuery, exampleQueries } = useContext(QueryContext);
    const { loadFromQuery, clearGraph } = useContext(GraphContext);
    const [isLoadVisible, setIsLoadVisible] = useState(false);
    const [isExamplesVisible, setIsExamplesVisible] = useState(false);
    const [isHelpVisible, setIsHelpVisible] = useState(false);

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

            { isHelpVisible &&
                <Modal 
                    onClose={() => setIsHelpVisible(false)}
                    title="Help"
                >
                    <h3>About the project</h3>
                    <p className="text-normal">
                        This application was designed as a tool to help connect metadata from very diverse biological databases and enable joint queries over all collected metadata.
                        The software was created as part of the PhD project at University of Belgrade, Faculty of Mathematics, by student <a href="mailto:aleksandar@matf.bg.ac.rs">Aleksandar Veljković</a>.
                    </p>

                    <h3>Data sources</h3>
                    <p className="text-normal">The metadata currently linked in our database is imported from four external databases:</p>
                        <ul>
                            <li><a href="https://disprot.org">DisProt</a></li>
                            <li><a href="https://www.genenames.org/">HGNC</a></li>
                            <li><a href="https://www.disgenet.org/">DisGeNET</a></li>
                            <li><a href="http://projects.met-hilab.org/tadb/">Tantigen 2.0</a></li>
                        </ul>
                    <p className="text-normal">We are constantly expanding the list of our datasets.</p>

                    <h3>FAQ</h3>

                    <BioAccordion title="What is BioGraph?">
                        BioGraph is a graph structure constructed of metadata from multiple biological databases.
                        One biological entity may contain data fragments in various databases. BioGraph
                        recognizes those fragments and links them to a single entity in a graph, enabling efficient, uniform, search over all linked datasets. 
                    </BioAccordion>
                    <BioAccordion title="How to query data?">
                        ...
                    </BioAccordion>
                    <BioAccordion title="How to draw nodes?">
                        ...
                    </BioAccordion>
                    <BioAccordion title="How to connect nodes?">
                        ...
                    </BioAccordion>
                    <BioAccordion title="How to add parameters?">
                        ...
                    </BioAccordion>
                    <BioAccordion title="How to read the results?">
                        ...
                    </BioAccordion>
                    <BioAccordion title="How to navigate through data graph?">
                        ...
                    </BioAccordion>
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
                <a className="header-item" href="#" onClick={() => setIsHelpVisible(true)}>
                    <HelpOutline/>
                    Help
                </a>
            </div>
       </header>
    )
}