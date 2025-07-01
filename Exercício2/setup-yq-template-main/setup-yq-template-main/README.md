## [Available versions](https://github.com/mikefarah/yq/releases)

**This action uses by default amd64 arquitechture, arm64 is also cached you can change arquitechture with example below:**

## Warning 
Please always invoke this action in your workflow, support is not provided in case you fork or copy the code to your GitHub repository.
If you need any improvement or new feature for this action, please consider request it [here](https://atc.bmwgroup.net/confluence/x/Q5N9KgE).

## ## Usage example for amd64

```
    - name: Setup YQ CLI
      uses: orbit-actions/setup-yq@v1
      with:
        version: 4.40.5
        architecture: amd64
```

## Usage example for arm64

```
    - name: Setup YQ CLI
      uses: orbit-actions/setup-yq@v1
      with:
        version: 4.40.5
        architecture: arm64
```
## Supported Regions

**Regions**: eu-central-1, cn-north-1

| **Building Block Action** | **EMEA** | **China** |
|---------------------------|----------|-----------|
| setup-yq                  | ✅        | 	✅        |

Description:
- ✅ Supported – This feature is available.
- ❌ Not Supported – This feature is not available.

