# Give

## Project Description
This project, developed by **Pink Yoshi Technologies**, is called **Give** — a social decision-making website designed to help indecisive users make everyday choices with the support of their communities. Users can create posts with their options and create polls within groups, allowing friends and peers to vote and provide quick, visual feedback.

This project is associated with the **University of Auckland SOFTENG 310** course.

## What does this project do?
**Give** is a social decision-making website that provides a simple and interactive platform where users can create posts including photos and links of options they are undecided about — whether it's choosing an outfit, picking a restaurant, or deciding on a movie. Friends, family, or community members within their groups can vote in polls to help them

## Why is this project useful?
**Give** is designed for people who struggle with indecision and want instant feedback from their trusted circles. Instead of endless back-and-forth messages or being stuck in choice paralysis, users can post a poll and get clear, visual input from their groups. It’s a fun, social way to make everyday decisions easier, while also fostering engagement and interaction within communities.

## How do I get started? Including pre-requisites, install instructions, and how to test/deploy the project (if relevant)
**Getting Started**
The following should be installed: 
- Node.js
- npm (comes with Node.js)
- Git
 
**Clone the repository**
   ```
   git clone https://github.com/Pink-Yoshi-Technologies/Give.git
   cd Give
   ```
   
**Install dependencies**
  ```
  npm install
  npm install react-slick slick-carousel
  ```

**Set up environment variables**

Please contact us for ENV and API key instructions. Contact details can be found on the [wiki](../../wiki/Contributors).

**Connect to firebase** 

To access the database, see further instructions on the [wiki](../../wiki).
  
**Run the app locally**
  ```
  cd frontend
  npm start
```
and
```
  cd backend 
  node index.js

  ```

The app should now be running at:
  http://localhost:3000

**How to run the the test suite**
```
cd frontend
npm test -- --watchAll
```


## License
This project is licensed under the **MIT License**.

This means you are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, as long as you include the original copyright notice and license in any copies.

For full license details, refer to the [LICENSE](LICENSE) file in this repository.

## What versions are available?
We use semantic versioning (`MAJOR.MINOR.PATCH`) for all our releases.

Currently we only have 1 version available 

| Version | Status     | Notes                   |
|---------|------------|-------------------------|
| v0.0.0  | Unstable   | Development             |


## Where can I get more help, if I need it?
We have multiple resources for providing help if need be. 

**Wiki:** 

Our [wiki](../../wiki) includes additional documentation and outlines how to use the project. 

**Issues**  If you run into bugs or have feature requests, please check the [issues](./issues) page or create a new one.

We encourage communication through Github Pages and creating new Issues. 
