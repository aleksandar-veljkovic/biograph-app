import { ExpandMore } from '@mui/icons-material';
import { AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';

export const BioAccordion = ({ title, children }) => {
    return (
        <Accordion>
            <AccordionSummary
            expandIcon={<ExpandMore/>}
            aria-controls={`accordion-panel-${title}`}
            id={`accordion-panel-${title}`}
            >
            <Typography>{ title }</Typography>
            </AccordionSummary>
            <AccordionDetails>
            <Typography>
                { children }
            </Typography>
            </AccordionDetails>
        </Accordion>
    )
}