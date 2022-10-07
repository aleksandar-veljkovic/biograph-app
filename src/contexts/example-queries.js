const exampleQueries = [
    {
        title: "Genes related to highly disordered proteins",
        query: {
            "nodes": [
              {
                "id": "n7c2c3bf56dd247da9a3d859085c9451e",
                "position": {
                  "x": 295,
                  "y": 130
                },
                "type": "graphNode",
                "data": {
                  "defaultLabel": "node_n7c2c",
                  "label": null,
                  "isIncluded": true,
                  "properties": [],
                  "entityType": "Gene"
                }
              },
              {
                "id": "nb2ee0e92ed0742cf97f90148aa26bbb2",
                "position": {
                  "x": 835,
                  "y": 100
                },
                "type": "graphNode",
                "data": {
                  "defaultLabel": "node_nb2ee",
                  "label": null,
                  "isIncluded": false,
                  "properties": [
                    {
                      "field": "disorder_content",
                      "operator": "GT",
                      "value": "0.9"
                    }
                  ],
                  "entityType": "Protein"
                }
              }
            ],
            "edges": [
              {
                "source": "nb2ee0e92ed0742cf97f90148aa26bbb2",
                "sourceHandle": "b",
                "target": "n7c2c3bf56dd247da9a3d859085c9451e",
                "targetHandle": "b",
                "id": "E23638fce9ad04790861af6303c7d62a9",
                "animated": true,
                "data": {
                  "properties": [],
                  "data": {},
                  "edgeType": "FROM_GENE"
                },
                "type": "graphEdge",
                "style": {
                  "strokeWidth": "3px"
                },
                "sourceNode": {
                  "id": "nb2ee0e92ed0742cf97f90148aa26bbb2",
                  "position": {
                    "x": 835,
                    "y": 100
                  },
                  "type": "graphNode",
                  "data": {
                    "defaultLabel": "node_nb2ee",
                    "label": null,
                    "isIncluded": true,
                    "properties": [],
                    "entityType": "Protein"
                  }
                },
                "targetNode": {
                  "id": "n7c2c3bf56dd247da9a3d859085c9451e",
                  "position": {
                    "x": 295,
                    "y": 130
                  },
                  "type": "graphNode",
                  "data": {
                    "defaultLabel": "node_n7c2c",
                    "label": null,
                    "isIncluded": true,
                    "properties": [],
                    "entityType": "Gene"
                  }
                },
                "reversed": true
              }
            ]
          }
    }, {
        title: "Diseases related to highly disordered proteins",
        query: {
            "nodes": [
              {
                "id": "n7c2c3bf56dd247da9a3d859085c9451e",
                "position": {
                  "x": 295,
                  "y": 130
                },
                "type": "graphNode",
                "data": {
                  "defaultLabel": "node_n7c2c",
                  "label": null,
                  "isIncluded": false,
                  "properties": [],
                  "entityType": "Gene"
                }
              },
              {
                "id": "nb2ee0e92ed0742cf97f90148aa26bbb2",
                "position": {
                  "x": 835,
                  "y": 100
                },
                "type": "graphNode",
                "data": {
                  "defaultLabel": "node_nb2ee",
                  "label": null,
                  "isIncluded": false,
                  "properties": [
                    {
                      "field": "disorder_content",
                      "operator": "GT",
                      "value": "0.9"
                    }
                  ],
                  "entityType": "Protein"
                }
              },
              {
                "id": "n7af7a99db1ce49af9a0513fc3166d101",
                "position": {
                  "x": -200,
                  "y": 100
                },
                "type": "graphNode",
                "data": {
                  "defaultLabel": "node_n7af7",
                  "label": null,
                  "isIncluded": true,
                  "properties": [],
                  "entityType": "Disease"
                }
              }
            ],
            "edges": [
              {
                "source": "nb2ee0e92ed0742cf97f90148aa26bbb2",
                "sourceHandle": "b",
                "target": "n7c2c3bf56dd247da9a3d859085c9451e",
                "targetHandle": "b",
                "id": "E23638fce9ad04790861af6303c7d62a9",
                "animated": true,
                "data": {
                  "properties": [],
                  "data": {},
                  "edgeType": "FROM_GENE"
                },
                "type": "graphEdge",
                "style": {
                  "strokeWidth": "3px"
                },
                "sourceNode": {
                  "id": "nb2ee0e92ed0742cf97f90148aa26bbb2",
                  "position": {
                    "x": 835,
                    "y": 100
                  },
                  "type": "graphNode",
                  "data": {
                    "defaultLabel": "node_nb2ee",
                    "label": null,
                    "isIncluded": true,
                    "properties": [],
                    "entityType": "Protein"
                  }
                },
                "targetNode": {
                  "id": "n7c2c3bf56dd247da9a3d859085c9451e",
                  "position": {
                    "x": 295,
                    "y": 130
                  },
                  "type": "graphNode",
                  "data": {
                    "defaultLabel": "node_n7c2c",
                    "label": null,
                    "isIncluded": true,
                    "properties": [],
                    "entityType": "Gene"
                  }
                },
                "reversed": true
              },
              {
                "source": "n7af7a99db1ce49af9a0513fc3166d101",
                "sourceHandle": "b",
                "target": "n7c2c3bf56dd247da9a3d859085c9451e",
                "targetHandle": "b",
                "id": "Ea8a8762eed5c4edbab02556c7b334ca8",
                "animated": true,
                "data": {
                  "properties": [
                    {
                      "field": "score",
                      "operator": "GT",
                      "value": "0.5"
                    }
                  ],
                  "data": {},
                  "edgeType": "RELATED_GENE"
                },
                "type": "graphEdge",
                "style": {
                  "strokeWidth": "3px"
                },
                "sourceNode": {
                  "id": "n7af7a99db1ce49af9a0513fc3166d101",
                  "position": {
                    "x": -200,
                    "y": 100
                  },
                  "type": "graphNode",
                  "data": {
                    "defaultLabel": "node_n7af7",
                    "label": null,
                    "isIncluded": true,
                    "properties": [],
                    "entityType": "Disease"
                  }
                },
                "targetNode": {
                  "id": "n7c2c3bf56dd247da9a3d859085c9451e",
                  "position": {
                    "x": 295,
                    "y": 130
                  },
                  "type": "graphNode",
                  "data": {
                    "defaultLabel": "node_n7c2c",
                    "label": null,
                    "isIncluded": false,
                    "properties": [],
                    "entityType": "Gene"
                  }
                }
              }
            ]
          }
    }, {
      title: 'Relations between diseases and Antigens from disordered proteins',
      query: {
        "nodes": [
          {
            "id": "n7c2c3bf56dd247da9a3d859085c9451e",
            "position": {
              "x": 295,
              "y": 130
            },
            "type": "graphNode",
            "data": {
              "defaultLabel": "node_n7c2c",
              "label": null,
              "isIncluded": true,
              "properties": [],
              "entityType": "Gene"
            }
          },
          {
            "id": "nb2ee0e92ed0742cf97f90148aa26bbb2",
            "position": {
              "x": 835,
              "y": 100
            },
            "type": "graphNode",
            "data": {
              "defaultLabel": "node_nb2ee",
              "label": null,
              "isIncluded": false,
              "properties": [
                {
                  "field": "disorder_content",
                  "operator": "GT",
                  "value": "0.9"
                }
              ],
              "entityType": "Protein"
            }
          },
          {
            "id": "n1109c4fc886447f586d55e92601f44a1",
            "position": {
              "x": 175,
              "y": 385
            },
            "type": "graphNode",
            "data": {
              "defaultLabel": "node_n1109",
              "label": null,
              "isIncluded": true,
              "properties": [],
              "entityType": "Disease"
            }
          },
          {
            "id": "nb7b5594985b24162b881514902c242e4",
            "position": {
              "x": 625,
              "y": 580
            },
            "type": "graphNode",
            "data": {
              "defaultLabel": "node_nb7b5",
              "label": null,
              "isIncluded": true,
              "properties": [],
              "entityType": "Antigen"
            }
          },
          {
            "id": "n897a1e5c7f7f499aaafa68e8ad3bde56",
            "position": {
              "x": 625,
              "y": 700
            },
            "type": "graphNode",
            "data": {
              "defaultLabel": "node_n897a",
              "label": null,
              "isIncluded": true,
              "properties": [],
              "entityType": "Epitope"
            }
          }
        ],
        "edges": [
          {
            "source": "nb2ee0e92ed0742cf97f90148aa26bbb2",
            "sourceHandle": "b",
            "target": "n7c2c3bf56dd247da9a3d859085c9451e",
            "targetHandle": "b",
            "id": "E23638fce9ad04790861af6303c7d62a9",
            "animated": true,
            "data": {
              "properties": [],
              "data": {},
              "edgeType": "FROM_GENE"
            },
            "type": "graphEdge",
            "style": {
              "strokeWidth": "3px"
            },
            "sourceNode": {
              "id": "nb2ee0e92ed0742cf97f90148aa26bbb2",
              "position": {
                "x": 835,
                "y": 100
              },
              "type": "graphNode",
              "data": {
                "defaultLabel": "node_nb2ee",
                "label": null,
                "isIncluded": true,
                "properties": [],
                "entityType": "Protein"
              }
            },
            "targetNode": {
              "id": "n7c2c3bf56dd247da9a3d859085c9451e",
              "position": {
                "x": 295,
                "y": 130
              },
              "type": "graphNode",
              "data": {
                "defaultLabel": "node_n7c2c",
                "label": null,
                "isIncluded": true,
                "properties": [],
                "entityType": "Gene"
              }
            },
            "reversed": true
          },
          {
            "source": "n1109c4fc886447f586d55e92601f44a1",
            "sourceHandle": "b",
            "target": "n7c2c3bf56dd247da9a3d859085c9451e",
            "targetHandle": "b",
            "id": "Ef55f027880e04f3c95c04b9fdb8ea882",
            "animated": true,
            "data": {
              "properties": [
                {
                  "field": "score",
                  "operator": "GT",
                  "value": "0.5"
                }
              ],
              "data": {},
              "edgeType": "RELATED_GENE"
            },
            "type": "graphEdge",
            "style": {
              "strokeWidth": "3px"
            },
            "sourceNode": {
              "id": "n1109c4fc886447f586d55e92601f44a1",
              "position": {
                "x": 175,
                "y": 385
              },
              "type": "graphNode",
              "data": {
                "defaultLabel": "node_n1109",
                "label": null,
                "isIncluded": true,
                "properties": [],
                "entityType": "Disease"
              }
            },
            "targetNode": {
              "id": "n7c2c3bf56dd247da9a3d859085c9451e",
              "position": {
                "x": 295,
                "y": 130
              },
              "type": "graphNode",
              "data": {
                "defaultLabel": "node_n7c2c",
                "label": null,
                "isIncluded": true,
                "properties": [],
                "entityType": "Gene"
              }
            },
            "reversed": true
          },
          {
            "source": "n7c2c3bf56dd247da9a3d859085c9451e",
            "sourceHandle": "b",
            "target": "nb7b5594985b24162b881514902c242e4",
            "targetHandle": "b",
            "id": "Eb2b77fa52612445691ddcceb7f382d87",
            "animated": true,
            "data": {
              "properties": [],
              "data": {},
              "edgeType": "IS_ANTIGEN"
            },
            "type": "graphEdge",
            "style": {
              "strokeWidth": "3px"
            },
            "sourceNode": {
              "id": "n7c2c3bf56dd247da9a3d859085c9451e",
              "position": {
                "x": 295,
                "y": 130
              },
              "type": "graphNode",
              "data": {
                "defaultLabel": "node_n7c2c",
                "label": null,
                "isIncluded": true,
                "properties": [],
                "entityType": "Gene"
              }
            },
            "targetNode": {
              "id": "nb7b5594985b24162b881514902c242e4",
              "position": {
                "x": 625,
                "y": 580
              },
              "type": "graphNode",
              "data": {
                "defaultLabel": "node_nb7b5",
                "label": null,
                "isIncluded": true,
                "properties": [],
                "entityType": "Antigen"
              }
            },
            "reversed": true
          },
          {
            "source": "nb7b5594985b24162b881514902c242e4",
            "sourceHandle": "b",
            "target": "n897a1e5c7f7f499aaafa68e8ad3bde56",
            "targetHandle": "b",
            "id": "E77a3d57ac2024530bc2d41bd16cd8f02",
            "animated": true,
            "data": {
              "properties": [],
              "data": {},
              "edgeType": "HAS_EPITOPE"
            },
            "type": "graphEdge",
            "style": {
              "strokeWidth": "3px"
            },
            "sourceNode": {
              "id": "nb7b5594985b24162b881514902c242e4",
              "position": {
                "x": 625,
                "y": 580
              },
              "type": "graphNode",
              "data": {
                "defaultLabel": "node_nb7b5",
                "label": null,
                "isIncluded": true,
                "properties": [],
                "entityType": "Antigen"
              }
            },
            "targetNode": {
              "id": "n897a1e5c7f7f499aaafa68e8ad3bde56",
              "position": {
                "x": 625,
                "y": 700
              },
              "type": "graphNode",
              "data": {
                "defaultLabel": "node_n897a",
                "label": null,
                "isIncluded": true,
                "properties": [],
                "entityType": "Epitope"
              }
            },
            "reversed": true
          }
        ]
      }
    }
]

export default exampleQueries;