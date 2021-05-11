# ui5-task-librarian

This [UI5 Tooling](https://sap.github.io/ui5-tooling) custom task aims to track down unused libraries in your projects.
Unused UI5 libraries should be removed from your code to improve performance.

## Installation

From the root of your UI5 project: `npm i -D ui5-task-librarian`

To make UI5 tooling aware of the dependency add the dependency to the ui5 tooling dependencies in your ui5 `package.json`:

```json
{
  "name": "demo",
  "devDependencies": {
    "@ui5/cli": "^1.14.0",
    "ui5-task-librarian": "*"
  },
  "ui5": {
    "dependencies": ["ui5-task-librarian"]
  }
}
```

Add the build task to the `ui5.yaml` configuration:

```yaml
builder:
  customTasks:
    - name: ui5-task-librarian
      beforeTask: replaceCopyright
      configuration:
        debug: false
        strict: false
        listusedlibs: false
```

## Output

Unused libraries will be reported. SAP and OpenUI5 libraries are reported at warning level, others at info level.

```shell_session
info builder:builder application skills 🔨 (2/9) Running task ui5-task-librarian...
WARN builder:customtask:librarian 📚 Unused UI5 library sap.ui.comp.smartform at /resources/com/pj/demo/view/App.view.xml
WARN builder:customtask:librarian 📚 Unused UI5 library sap.ui.comp.smartfield at /resources/com/pj/demo/view/App.view.xml
WARN builder:customtask:librarian 📚 Unused UI5 library sap.ui.layout at /resources/com/pj/demo/view/App.view.xml
WARN builder:customtask:librarian 📚 Unused UI5 library sap.suite.ui.microchart at /resources/com/pj/demo/view/App.view.xml
info builder:customtask:librarian 📚 Unused library or resource ./model/formatter at /resources/com/pj/demo/test/unit/AllTests.js
info builder:customtask:librarian 📚 Unused library or resource ./ObjectJourney at /resources/com/pj/demo/test/integration/AllJourneys.js
WARN builder:customtask:librarian 📚 Unused UI5 library sap/m/MessageBox at /resources/com/pj/demo/controller/App.controller.js
```

## Configuration Options

### listusedlibs (true|false)
Used libraries will be reported instead of the unused ones. SAP, OpenUI5 or others reported at info level. Overrides regular output.
```shell_session
info builder:builder application skills 🔨 (2/9) Running task ui5-task-librarian...
WARN builder:customtask:librarian 📚 UI5 Library used: sap.ui.comp.smartform at /resources/com/pj/demo/view/App.view.xml
WARN builder:customtask:librarian 📚 UI5 Library used: sap.ui.comp.smartfield at /resources/com/pj/demo/view/App.view.xml
WARN builder:customtask:librarian 📚 UI5 Library used: sap.ui.layout at /resources/com/pj/demo/view/App.view.xml
WARN builder:customtask:librarian 📚 UI5 Library used: sap.suite.ui.microchart at /resources/com/pj/demo/view/App.view.xml
info builder:customtask:librarian 📚 External library or resource used: ./model/formatter at /resources/com/pj/demo/test/unit/AllTests.js
info builder:customtask:librarian 📚 External library or resource used: ./ObjectJourney at /resources/com/pj/demo/test/integration/AllJourneys.js
WARN builder:customtask:librarian 📚 UI5 Library used: sap/m/MessageBox at /resources/com/pj/demo/controller/App.controller.js
```

### strict (true|false)

Stop after running the task and redundant libs have been detected. Use only when not using listusedlibs option.

```shell_session
info builder:builder application skills 🔨 (2/9) Running task ui5-task-librarian...
WARN builder:customtask:librarian 📚 Unused UI5 library sap/m/MessageBox at /resources/com/pj/demo/controller/App.controller.js
ERR! builder:customtask:librarian 📚 The librarian is configured to be strict, please remove redundancies and rebuild.
```

### debug (true|false)

Verbose logging to show all files that are scanned for unused libraries

## License

[Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0.txt)

## Funding

🍺
