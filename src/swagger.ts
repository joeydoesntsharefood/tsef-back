const openAPIConfig = {
  paths: {
    '/provider': {
      get: {
        summary: 'Find Provider',
        responses: {
          '200': {
            description: 'Success'
          }
        },
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'Mateus'
                  },
                  country_code: {
                    type: 'string',
                    example: '20202020'
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create Provider',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'Mateus'
                  },
                  country_code: {
                    type: 'string',
                    example: 'usa'
                  }
                },
                required: ['name', 'country_code']
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Provider created successfully'
          },
          '400': {
            description: 'Invalid input'
          }
        }
      }
    },
    '/utils/refresh-token': {
      post: {
        summary: 'Refresh Token',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  refreshToken: {
                    type: 'string',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNwbnRuLm1hdGV1c0BnbWFpbC5jb20iLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTcyMTczNzAzMCwiZXhwIjoxNzIxOTA5ODMwfQ.jnr6gUIy-qDH4U3wZwKL8ZBLTZCoXuKwm78koxMWed4',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Success',
          },
        },
      },
    },
    '/register': {
      post: {
        summary: 'Register',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'Mateus Silva',
                  },
                  email: {
                    type: 'string',
                    example: 'mateus@gmail.com',
                  },
                  password: {
                    type: 'string',
                    example: 'Abacates3825.',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Success',
          },
        },
      },
    },
    '/login': {
      post: {
        summary: 'Login',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                    example: 'mateus@gmail.com',
                  },
                  password: {
                    type: 'string',
                    example: 'Abacates3825.',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Success',
          },
        },
      },
    },
    '/provider/{id}': {
      get: {
        summary: 'Index Provider',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              example: '14d008d4-c494-4404-87eb-fa2e0587a54a',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Success',
          },
        },
      },
      patch: {
        summary: 'Edit Provider',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              example: '14d008d4-c494-4404-87eb-fa2e0587a54a',
            },
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'Mateus Silva',
                  },
                  country_code: {
                    type: 'string',
                    example: '20202020',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Success',
          },
        },
      },
      delete: {
        summary: 'Delete Provider',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              example: '47ed4f9d-cf75-488c-8e2b-bf73936ef20b',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Success',
          },
        },
      },
    },
    '/product': {
      get: {
        summary: 'Find Product',
        parameters: [
          {
            name: 'page',
            in: 'query',
            required: false,
            schema: {
              type: 'integer',
              example: 2,
            },
          },
        ],
        responses: {
          '200': {
            description: 'Success',
          },
        },
      },
      post: {
        summary: 'Create Product',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'Produto 2',
                  },
                  description: {
                    type: 'string',
                    example: 'Produto teste sento testado',
                  },
                  price: {
                    type: 'number',
                    example: 0.5,
                  },
                  quantity: {
                    type: 'integer',
                    example: 2,
                  },
                  category: {
                    type: 'string',
                    example: 'Teste Peculiar',
                  },
                  providerId: {
                    type: 'string',
                    example: '561d4a75-87f3-43af-b078-8fb9b2ac4ff1',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Success',
          },
        },
      },
    },
    '/product/{id}': {
      get: {
        summary: 'Index Product',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              example: 'd78760e4-159a-4e8a-be72-510e1b249ca7',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Success',
          },
        },
      },
      patch: {
        summary: 'Edit Product',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              example: 'd78760e4-159a-4e8a-be72-510e1b249ca7',
            },
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'Produto 2',
                  },
                  description: {
                    type: 'string',
                    example: 'Produto teste sento testado',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Success',
          },
        },
      },
      delete: {
        summary: 'Delete Product',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              example: '47ed4f9d-cf75-488c-8e2b-bf73936ef20b',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Success',
          },
        },
      },
    },
  },
};

export default openAPIConfig;
