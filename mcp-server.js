#!/usr/bin/env node

/**
 * MCP Server for Min Taktikk - Football Tactics Analyzer
 * Provides tools for analyzing and manipulating football tactics data
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} = require('@modelcontextprotocol/sdk/types.js');
const fs = require('fs/promises');
const path = require('path');

class MinTaktikkServer {
  constructor() {
    this.server = new Server(
      {
        name: 'min-taktikk-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_tactics_data',
            description: 'Get football tactics data from JSON files',
            inputSchema: {
              type: 'object',
              properties: {
                filename: {
                  type: 'string',
                  description: 'Name of the tactics file (e.g., "pasningsmonster.json")',
                },
              },
              required: ['filename'],
            },
          },
          {
            name: 'analyze_formation',
            description: 'Analyze a football formation from tactics data',
            inputSchema: {
              type: 'object',
              properties: {
                data: {
                  type: 'object',
                  description: 'Tactics data object to analyze',
                },
              },
              required: ['data'],
            },
          },
          {
            name: 'create_tactics_animation',
            description: 'Create a new tactics animation configuration',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Name of the animation',
                },
                players: {
                  type: 'array',
                  description: 'Array of player positions and movements',
                  items: {
                    type: 'object',
                    properties: {
                      x: {
                        type: 'number',
                        description: 'Player X position'
                      },
                      y: {
                        type: 'number',
                        description: 'Player Y position'
                      },
                      color: {
                        type: 'string',
                        description: 'Player color (hex code)'
                      },
                      number: {
                        type: 'string',
                        description: 'Player number'
                      },
                      movements: {
                        type: 'array',
                        description: 'Array of movement positions',
                        items: {
                          type: 'object',
                          properties: {
                            x: {
                              type: 'number',
                              description: 'Movement X position'
                            },
                            y: {
                              type: 'number',
                              description: 'Movement Y position'
                            }
                          }
                        }
                      }
                    }
                  }
                },
                duration: {
                  type: 'number',
                  description: 'Duration of the animation in seconds',
                },
              },
              required: ['name', 'players'],
            },
          },
          {
            name: 'list_tactics_files',
            description: 'List all available tactics files',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'save_tactics_data',
            description: 'Save tactics data to a JSON file',
            inputSchema: {
              type: 'object',
              properties: {
                filename: {
                  type: 'string',
                  description: 'Name of the file to save',
                },
                data: {
                  type: 'object',
                  description: 'Tactics data to save',
                },
              },
              required: ['filename', 'data'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;

        switch (name) {
          case 'get_tactics_data':
            return await this.getTacticsData(args.filename);

          case 'analyze_formation':
            return await this.analyzeFormation(args.data);

          case 'create_tactics_animation':
            return await this.createTacticsAnimation(args);

          case 'list_tactics_files':
            return await this.listTacticsFiles();

          case 'save_tactics_data':
            return await this.saveTacticsData(args.filename, args.data);

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Error executing tool: ${error.message}`
        );
      }
    });
  }

  async getTacticsData(filename) {
    try {
      const filePaths = [
        path.join(__dirname, 'public', 'examples', filename),
        path.join(__dirname, 'build', 'examples', filename),
        path.join(__dirname, 'public', filename),
        path.join(__dirname, 'build', filename),
      ];

      let data = null;
      let foundPath = null;

      for (const filePath of filePaths) {
        try {
          const content = await fs.readFile(filePath, 'utf-8');
          data = JSON.parse(content);
          foundPath = filePath;
          break;
        } catch (err) {
          // Continue to next path
        }
      }

      if (!data) {
        throw new Error(`File not found: ${filename}`);
      }

      return {
        content: [
          {
            type: 'text',
            text: `Tactics data from ${foundPath}:\n${JSON.stringify(data, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to read tactics data: ${error.message}`);
    }
  }

  async analyzeFormation(data) {
    try {
      const analysis = {
        totalPlayers: 0,
        positions: {},
        movements: 0,
        averagePosition: { x: 0, y: 0 },
      };

      if (data.elements) {
        analysis.totalPlayers = data.elements.filter(el => el.type === 'player').length;
        
        data.elements.forEach(element => {
          if (element.type === 'player') {
            const pos = `${Math.round(element.x / 50)}-${Math.round(element.y / 50)}`;
            analysis.positions[pos] = (analysis.positions[pos] || 0) + 1;
            analysis.averagePosition.x += element.x;
            analysis.averagePosition.y += element.y;
          } else if (element.type === 'trace') {
            analysis.movements++;
          }
        });

        if (analysis.totalPlayers > 0) {
          analysis.averagePosition.x /= analysis.totalPlayers;
          analysis.averagePosition.y /= analysis.totalPlayers;
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: `Formation Analysis:
- Total Players: ${analysis.totalPlayers}
- Movement Traces: ${analysis.movements}
- Average Position: (${analysis.averagePosition.x.toFixed(1)}, ${analysis.averagePosition.y.toFixed(1)})
- Position Distribution: ${JSON.stringify(analysis.positions, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to analyze formation: ${error.message}`);
    }
  }

  async createTacticsAnimation(args) {
    const { name, players, duration = 10 } = args;
    
    const animation = {
      name,
      version: "1.0",
      created: new Date().toISOString(),
      duration,
      elements: [],
      frames: []
    };

    // Add players as elements
    players.forEach((player, index) => {
      animation.elements.push({
        id: `player-${index + 1}`,
        type: 'player',
        x: player.x || 100,
        y: player.y || 100,
        color: player.color || '#FF0000',
        number: player.number || (index + 1).toString()
      });
    });

    // Create animation frames if movements are provided
    if (players.some(p => p.movements)) {
      const frameCount = 10;
      for (let i = 0; i <= frameCount; i++) {
        const frame = {
          time: (i / frameCount) * duration,
          elements: {}
        };
        
        players.forEach((player, playerIndex) => {
          if (player.movements && player.movements.length > 0) {
            const elementId = `player-${playerIndex + 1}`;
            const progress = i / frameCount;
            const movementIndex = Math.floor(progress * (player.movements.length - 1));
            const movement = player.movements[movementIndex] || player.movements[0];
            
            frame.elements[elementId] = {
              x: movement.x,
              y: movement.y
            };
          }
        });
        
        animation.frames.push(frame);
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: `Created tactics animation "${name}":\n${JSON.stringify(animation, null, 2)}`,
        },
      ],
    };
  }

  async listTacticsFiles() {
    try {
      const directories = [
        path.join(__dirname, 'public', 'examples'),
        path.join(__dirname, 'build', 'examples'),
        path.join(__dirname, 'public'),
        path.join(__dirname, 'build'),
      ];

      const allFiles = [];

      for (const dir of directories) {
        try {
          const files = await fs.readdir(dir);
          const jsonFiles = files
            .filter(file => file.endsWith('.json'))
            .map(file => ({ file, path: path.join(dir, file) }));
          allFiles.push(...jsonFiles);
        } catch (err) {
          // Directory might not exist, continue
        }
      }

      // Remove duplicates based on filename
      const uniqueFiles = allFiles.filter((file, index, self) => 
        index === self.findIndex(f => f.file === file.file)
      );

      return {
        content: [
          {
            type: 'text',
            text: `Available tactics files:\n${uniqueFiles.map(f => `- ${f.file} (${f.path})`).join('\n')}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to list tactics files: ${error.message}`);
    }
  }

  async saveTacticsData(filename, data) {
    try {
      const filePath = path.join(__dirname, 'public', 'examples', filename);
      
      // Ensure directory exists
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      
      // Save the data
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));

      return {
        content: [
          {
            type: 'text',
            text: `Tactics data saved to: ${filePath}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to save tactics data: ${error.message}`);
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Min Taktikk MCP server running on stdio');
  }
}

const server = new MinTaktikkServer();
server.run().catch(console.error);