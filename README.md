# liquid-moon-frontend

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

## Compile for Production

Copy `.env.example` and rename to `.env`

Add `VUE_APP_API_BASE_URL` and set it to `http://47.119.197.247/a/r/api` or any api URL

```
yarn install
yarn build
```

All the compiled code will be available in `dist` folder.

## Vue Components

### Alert

To show alert, emit a alert event with an object containing the following properties.

- type: `success` or `error` or `info` (default)
- title: The title. Optional.
- message: The message. Required.
- buttonText: Text of the button. Default to "OK"

```Vue
this.emitter.emit('alert', { message: 'This is an alert message' })
this.emitter.emit('alert', { type: 'success', title: 'Yeay!', message: 'It is done! You can take your holiday now.' })
this.emitter.emit('alert', { type: 'error', title: 'Oops!', message: 'That could not be done', buttonText: 'Hmm okay...' })
```

### Notification

To show notification, emit a notification event with an object containing the following properties. Notification auto close after 5s.

- type: `success` or `error`. Required.
- title: The notification title. Optional.
- message: The message. Required.

Examples:

```Vue
this.emitter.emit("notification", { type: 'success', title: 'Successfully saved!', message: 'This is a success message' })
```

```Vue
this.emitter.emit("notification", { type: 'error', title: 'Ooops!', message: 'This is an error message' })
```

### Loading / Processing Dialog

Show loading or processing dialog and block user interaction. No need to explicitly imported into other components.

- open: Boolean. Whether the dialog is shown
- title: Title to show. Default to "Processing"
- message: Displayed below the title. Optional.

Example:

``` Vue
<LoadingDialog
    :open="isProcessing"
    title="Processing"
    message="Do not close or refresh your browser" />
```