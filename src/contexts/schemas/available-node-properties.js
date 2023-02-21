const availableNodeProperties = {
    unselected: [],
    Gene: [{
        value: 'identifier',
        label: 'Gene ID',
        identifier: true,
    }],

    Organism: [{
        value: 'identifier',
        label: 'Organism ID',
        identifier: true,
    }],

    Protein: [{
        value: 'identifier',
        label: 'Protein ID',
        identifier: true,
    },
    {
        value: 'proteinName',
        label: 'Protein Name',
        identifier: true,
    },
    {
        value: 'disorder_content',
        label: 'Disorder content',
        isNumeric: true,
    },
    {
        value: 'regions_counter',
        label: 'Num. regions',
        isNumeric: true,
    }
    ],

    Disease: [
        {
            value: 'identifier',
            label: 'Disease ID',
            identifier: true,
        },
        {
            value: 'disease_type',
            label: 'Disease Type'
        }
    ],
    Antigen: [
        {
            value: 'identifier',
            label: 'Antigen ID',
            identifier: true,
        },
    ],
    Epitope: [
        {
            value: 'identifier',
            label: 'Epitope ID',
            identifier: true,
        },
        {
            value: 'positionFrom',
            label: 'Start pos.',
            isNumeric: true,
        },
        {
            value: 'positionTo',
            label: 'End pos.',
            isNumeric: true,
        }
    ]
};

export default availableNodeProperties;