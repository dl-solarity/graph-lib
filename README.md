[![npm](https://img.shields.io/npm/v/@dlsl/graph-modules.svg)](https://www.npmjs.com/package/@dlsl/graph-modules) 
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Graph Modules by Distributed Lab

This repository contains utility modules for implementting subgraphs for [The Graph protocol](https://thegraph.com/en/). The modules can be imported and used to help develop extended subgraphs logic for numerous tasks. 

_The project is in the early stage of development and many new modules will be added soon. Here is what is available right now:_

- ArrayHelper module to ease work with arrays

## Overview

### Installation

```console
$ npm install @dlsl/graph-modules
```

The latest stable version is always in the `master` branch.

### Usage

```typescript
import { pushUnique } from '@dlsl/graph-modules'

export function handleDelegated(event: Delegated): void {
    . . .

    user.delegateNfts = pushUnique<BigInt>(user.delegateNfts, event.params.nfts);

    . . .
}
```

You will find the helper modules in the `/modules` directory. 

## License

The development modules are released under the MIT License.
