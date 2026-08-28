# @srisomanaath/cli

A CLI tool for adding components from [srisomanaath](https://srisomanaath.in/craft) and configuring MCP (Model Context Protocol) for AI coding assistants.

## Installation

```bash
# Using npm
npx @srisomanaath/cli

# Or install globally
npm install -g @srisomanaath/cli
```

## Commands

### `add`

Add srisomanaath components to your project. This command integrates with the shadcn CLI to install components along with all required dependencies.

**Usage:**

```bash
# Add a single component
npx @srisomanaath/cli add [component]

# Add multiple components
npx @srisomanaath/cli add [component1] [component2] [component3]
```

**Examples:**

```bash
# Add the magical-mouse component
npx @srisomanaath/cli add magical-mouse

# Add multiple components at once
npx @srisomanaath/cli add book game-of-life pixel-icon
```

**Available Components:**

- `book` - An interactive 3D book component
- `game-of-life` - Conway's Game of Life implementation
- `magical-mouse` - Magical mouse trail effect
- `modern-progress` - Modern progress bar component
- `pixel-icon` - Pixelated icon component
- `view-magnifier` - View magnifier effect
- `split-text-effect` - Animated text splitting effect

### `install`

Configure MCP (Model Context Protocol) for AI coding assistants. This enables AI assistants like Claude, Cursor, Cline, and others to access srisomanaath components directly.

**Usage:**

```bash
npx @srisomanaath/cli install <client>
```

**Supported Clients:**

- `claude` - Claude Desktop
- `cursor` - Cursor IDE
- `cline` - Cline VS Code extension
- `roo-cline` - Roo-Cline VS Code extension
- `windsurf` - Windsurf IDE

**Examples:**

```bash
# Configure MCP for Claude Desktop
npx @srisomanaath/cli install claude

# Configure MCP for Cursor IDE
npx @srisomanaath/cli install cursor

# Configure MCP for Cline
npx @srisomanaath/cli install cline
```

After installation, you may need to restart your AI assistant to see the srisomanaath MCP server.

## What is MCP?

Model Context Protocol (MCP) allows AI coding assistants to access external tools and data sources. By installing the srisomanaath MCP server, your AI assistant can:

- Browse available components
- Get detailed implementation information
- View example code
- Receive proper installation instructions

This makes it easier to discover and implement srisomanaath components in your projects.

## Requirements

- Node.js 16+
- A project initialized with shadcn/ui (for the `add` command)

## Links

- [Website](https://srisomanaath)
- [Component Registry](https://srisomanaath.in/craft)
- [GitHub](https://github.com/srisomanaath/srisomanaath)

## License

Licensed under the [MIT license](https://github.com/srisomanaath/srisomanaath/blob/main/LICENSE).
