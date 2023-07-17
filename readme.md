# Readme

This is a receipt generator that i built for my own use.
It's specialized for the information needed on swedish receipts.

I have used this project to start learning how to do different types of testing in frontend application.

You can read more about that below.

## Testing

This is the first time i decided to do extensive automated testing in a frontend application.

I have started using various types of testing methods.

### Unit

I have implemented unit tests for all functionality i can easily break out into their own isolated functions.

As a side effect of this a lot of functionality have their own modules and are reusable.

This also makes them easy to mock when reused in other functions, hooks or components.

In this project a module should be a short function that has one responsibility.

Ideally it should either orchestrate different function calls, or do some kind of operation itself.

### Black box testing + ui testing

I am using black box tesing to test my react hooks and components.

I do this since both hooks and components usually result in changes to what is present in the DOM.
In addition to this both hooks and components only expose what they return so testing internals are hard.

I found that breaking out functionality into separated modules and unit testing them individually is easier than trying to test them through the output of the hook or component they're used in.

Because of that i try to keep my hooks and components as lean as possible with a focus on containing the jsx needed to render the dom to the user.
They can in turn use unit tested logic extracted into modules to do the "real work".

When i test react hooks i create a barebones component to use them in, and then assert on the rendered result.

When black box testing i rely on the real implementations of the extracted unit tested modules.

# Todo

- [ ] Date selector crashes the app if not using swedish locale.
