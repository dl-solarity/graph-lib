[![npm](https://img.shields.io/npm/v/@solarity/graph-lib.svg)](https://www.npmjs.com/package/@solarity/graph-lib)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Graph Modules by Distributed Lab

This repository contains utility modules for implementing subgraphs for [The Graph protocol](https://thegraph.com/en/). The modules can be imported and used to help develop extended subgraphs logic for numerous tasks.

_The project is in the early stage of development and many new modules will be added soon. Here is what is available right now:_

- array-helper module to ease work with arrays
- hash-table module to bound two arrays (like key-value struct) efficiently
- history-searcher module to search previous history entity with id pattern `idBase + blockNumber`
- type-utils module to easily determine if a given value is an instance of `ByteArray`, `Bytes`, or `Address`

## Overview

### Installation

```console
$ npm install @solarity/graph-lib
```

The latest stable version is always in the `master` branch.

### Usage

```typescript
import { pushUnique } from '@solarity/graph-lib'

export function handleDelegated(event: Delegated): void {
    . . .

    user.delegateNfts = pushUnique<BigInt>(user.delegateNfts, event.params.nfts);

    . . .
}
```

You will find the helper modules in the `/modules` directory.

## License

The library is released under the MIT License.
