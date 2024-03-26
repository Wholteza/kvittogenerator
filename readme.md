# Readme

This is a receipt generator that i built for my own use.
It's specialized for the information needed on swedish receipts.

I have used this project to start learning how to do different types of testing in frontend application.

You can read more about that below.

## Getting started

1. Install Node 20
1. `npm install`
1. `npm run dev`

## Tasks

### Improve process

- [x] User types receipt number as the first field
- [x] User selects the receipt date as the 2nd field
- [ ] Receipt row date is autoset to receipt date upon change
- [ ] Company information is hidden in settings after set
- [x] Logotype is part of company information

## Testing

This is the first time i decided to do extensive automated testing in a frontend application.

I have based my testing on my previous experience in software testing which is mostly writing backend unit test and frontend UI tests using cypress and api mocking.

When it comes to backend unit testing my philosophy is to test EVERYTHING. I want as close to 100% coverage as possible to be able to pinpoint exactly what is working, and what is not working when i introduce changes.

To keep my unit tests robust and quick to run I am identifying and mocking all external dependencies. Either a function has important business logic to be tested, or I need to make sure that the function is orchestrating the correct calls to other functions containing that business logic.

Since frontend unit testing, in this case a react application, is a different environment than what I'm used to the test code base is going to consistantly evolve as I discover new things.

### Unit testing

I have implemented unit tests for all functionality i can easily break out into their own isolated functions.

As a side effect of this a lot of functionality have their own modules and are reusable.
This also makes them easy to mock when reused in other functions, hooks or components.

In this project a module should be a short function that has one responsibility.
Ideally it should either orchestrate different function calls, or do some kind of operation itself.

I had some cases where i had orchestrating functions that passed an input value to multiple different functions, either pure functions that return a new value or functions with side effects.
After some reading i decided that i will also do pure unit testing in the form of mocking ALL dependencies even in these cases. What i test is that the function is passing the parameters into the correct dependencies, and not what the dependencies actually return. I can then do an integration test (or component test, depending on what you want to call it), to make sure that the function has the correct integrating behavior towards the rest of the system.

### Black box testing + ui testing

**I'm not so sure about this yet, but what has emerged is that i find myself breaking out more and more logic out of react components and hooks since i find them a bit problematic to test..**

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
