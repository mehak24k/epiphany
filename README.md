# Epiphany

Check out our deployed app [here](https://whispering-oasis-25381.herokuapp.com/)!

_**Level of Achievement: Apollo 11**_

**Table of Contents**
  - [Project Scope](#project-scope)
  - [Problem Motivation](#problem-motivation)
  - [User Stories](#user-stories)
  - [Program Flow](#program-flow)
  - [Core Features](#core-features)
  - [Testing and Security Features](#testing-and-security-features)
  - [Extensions](#extensions)
  - [Software Engineering Related](#software-engineering-related)
  - [How is our application different?](#how-is-our-application-different)
  - [Problems encountered/Bugs squashed](#problems-encounteredbugs-squashed)
  - [FAQ](#faq)
  - [Appendix](#appendix)

## Project Scope

This is a web application to facilitate the exchange of bite-sized information about concepts in various modules across NUS students, lecturers and TAs (also known as microlearning).

Users can share information with their peers (or students, in the case of lecturers or TAs) in the form of articles or videos and tag their uploads with relevant tags (e.g. Module codes, names of concepts). Students can also ask questions to clarify anything in the uploaded resource in the Q&A section under the resource. Peers, lectures or TAs can respond to the questions.

## Problem Motivation

NUS students lack a platform where they can access relevant resources to aid them in learning content specific to their modules. Often, students turn to the Internet to source for resources to help clarify concepts. However, searching for answers to certain questions online does not promote a deep understanding of the subject matter. This is especially because bits and pieces of somewhat-relevant information do not form a solid understanding of concepts.

We want to make a website application that facilitates microlearning where NUS students can help one another with learning module-specific content in bite-sized pieces. After all, it is common to find that we understand our peers’ explanations better than the lecturers’! Also, an overload of content often leaves students confused. Being able to internalize information in smaller, bite-sized pieces in the form of short articles and videos explaining concepts in simple terms will encourage interest and a good understanding of concepts.

Microlearning has many benefits such as improving learners’ information retention and requiring less time commitment with targeted information.

## User Stories

* As a student who is unclear on concepts taught in a module, I want to be able to access past resources to help me understand specific concepts in a simple and bite-sized way.
* As a student, TA or lecturer, I want to upload short articles or videos explaining specific concepts so that students can understand concepts more easily. 
* As a student, I want to make an account to login and ask questions and receive answers to my questions.
* As a TA or lecturer, I would like to have a permanent database of information such that my past uploaded materials are available to provide help to future students.
* As a TA or lecturer, I want to encourage students to help one another since this encourages collaborative learning.

## Program Flow

![Image](https://drive.google.com/uc?export=view&id=1B4XD-LdYVMmQGxtAQA9XOSMK87vXoB98)

## Core Features 
Features
---
**1.1 Posting - for registered users**
* Registered users can post an article or upload videos explaining concepts
* Short videos (5 - 10 minutes) targeted at certain concepts
* Short articles with a 10000-character limit
* Registered users can tag each post with relevant tags e.g. module codes, names of concepts
* E.g. A post titled ‘What are streams?’ can be tagged with ‘CS2030’, ‘Streams’, ‘Java’, ‘OOP’.
* Users can search for the tag they want to add.
* Users can create their own tags if the tag they want to use does not already exist in the database.
* Users can edit and delete their posts.
  
**1.2 Searching - for all website users**
* Users can search through the posts through words that match in the title or body of the posts.
* Filtration system where users can add tags to filter the posts. Only posts with all the indicated tags will appear on the homepage.
* The posts will be displayed only with their titles on the homepage. Users can click on the post to view the full content of the post.
* Users can click on other users who have posted to be brought to their profile page, where they can view all the posts by that user.

**1.3 Q&A - for registered users**
* Each video or article will have a Q & A section for registered users to post questions that anyone can help address.
* Registered users can reply to comments

**1.4 Upvoting - for registered users**
* Registered users can like or dislike posts for an indication of credibility and helpfulness of the post.
* Registered users can like or dislike comments for an indication of importance or helpfulness of the comment.

**1.5 Subscription system - for registered users**
* Registered users can subscribe to other users to follow their content. 

**1.6 Subscription system - for registered users**
* Registered users are able to check their profile for points and badges earned.
* Registered users are able to see their own posts and previously liked posts, as well as keep track of their followers and followed users. 

## Testing and Security Features

System Testing
---
**Portability Testing**

* Our website is responsive to shrinking windows on a laptop/desktop.

**Network Security**

* Passwords are hashed via a salt to guard against rainbow-table attacks

**Unit Testing**

* Each individual feature is tested when we finish them to check if it is working as intended

**Acceptance Testing**

* 10000 - character limit on article to be uploaded
* Restriction on the type of file that can be uploaded to prevent unwanted file types from being uploaded (mp4 only)
* Restrictions and error handling on website functionalities 
* Email confirmation is sent to ensure valid email
* Error flashed if email has already been used to sign up or if email/password is incorrect
* Users cannot login without email confirmation
* Users cannot create tags that already exist
* Users cannot edit posts that are not their own 

Error messages/Precautions taken
---

1.1 Posting - for registered users
* Users cannot create tags that already exist
* Users cannot edit posts that are not their own
* Users must be logged in to like/dislike posts
  
1.2 Searching - for all website users
* Users cannot search with a tag that does not exist

1.3 Q&A - for registered users
* Users must be logged in to comment on posts, but all users can view comments

1.4 Upvoting - for registered users
* Users must be logged in to like/dislike posts

1.5 Subscription system - for registered users
* Users cannot follow themselves

1.6 Loading system - for all website users
* Website will show loading symbol when the page has not finished loading to prevent most errors

User Testing
---

We sent out surveys to NUS students to test out our deployed website and from their feedback, implemented some improvements suggested by testers such as:
* making the search bars uniform
* Section for ‘posted by user’ in the homepage can be a darker gray
* comment box should only be visible to logged-in users

Testers did not find any unexpected errors in our website and felt that the features presented were very effective overall.

Most testers felt that there was a need for such a website, as their options for educational websites were limited to LumiNUS, youtube and Stack (from survey responses). 

## Extensions

A gamification system where users can achieve points/awards/badges by contributing or having their contributions liked. This would ideally, encourage users to contribute more quality content to the website.

A follow system for registered users to subscribe to other users. Users would then be able to see their followed posts and catch up on any new posts made.

## Software Engineering Related

**Trello Board**

We used this [trello board](https://trello.com/b/05FMrXER/agile-sprint-board) to categorise our workflow.
The tags indicate information about each part of our project along with which phase of development they belong to (milestones 1/2/3)
We have categorized our features based on ‘must-have’ and ‘good-to-have’
The descriptions for each card can be viewed  by clicking on the card
Note: click on the coloured tags to view their names.

**Features completed by June**

* Interface for contributors to upload videos and articles explaining concepts
* Search functionality
* Tag-filtering system
* Q&A section
* Upvoting

**Features completed by July**

* Gamification of the upvoting system (AKA implementation of badges) 
* Subscription system
* Enhanced design for ease of use

**Tech Stack**

* Flask, Python
* PostgreSQL
* ReactJS

Flask is a good microframework for us to use as it supports the functionalities we need for our app. Django is too heavy a framework for our current app. Flask is also extensible, which allows us to add packages that suit our needs depending on the components of our app. 

We learnt all these functionalities in one edX course CS50 and this fits our needs for this app. This saved time in learning more tech stack details and allowed us to spend more time in the design and implementation of our app.

Python is an OOP language and is easy-to-read.

PSQL is an object-relational database which would support inheritance etc. and the platform provider we chose, Heroku, prefers PSQL. Heroku was chosen because of its upgradeable free plan and relatively large number of data rows, which is sufficient for current use.  

We have chosen to incorporate ReactJS into our frontend for an enhanced design, as well as to reduce the load on our backend, such that the Flask app does not have to take care of both front and backends. We are also making use of Bootstrap in conjunction with ReactJS for interactive elements in our webpage, which is particularly useful for our forum-like site, where potential users would want to see immediate change in the website when they explore features.

## How is our application different?

**Piazza**

Piazza focuses on questions and answers, whereas our app is about strengthening students’ understanding of concepts through actual revision content.

**Youtube**

Youtube contains too broad a variety of content, whereas the content on our website will be entirely focused on NUS modules.
The uploaders are also students who have taken the module or lecturers/TAs and hence the information would be more credible and is likely to be more helpful as well.

**LumiNUS forum**

The LumiNUS forum, like Piazza, is primarily suited for only Q&A or simple discussions, unlike our website which will also contain revision content.
Furthermore, our website will be a permanent repository of information whereas LumiNUS modules expire access as soon as the semester is over.

**Stack**

Stack forums are primarily used for asking questions while users on our website would be posting information about concepts, with an added bonus of a Q&A section. 
Stack forums discourage questions about school work, however, the Q&A section in our app would be free for users to discuss about the post content as well as school-related work. 

## Problems encountered/Bugs squashed

* We had problems figuring out the relationships between posts and Q&A sections but after referring to examples and drawing the relationship map out, it became much clearer and it was then easy to implement. 
* Similarly, we had problems figuring out the relationship between users and followers as it was a self-referential relationship. We ended up googling around for answers and found an example in a blog tutorial. 
* We tried using ReactJS for the frontend but found that incorporating it with Flask was challenging at this point. Since we were more familiar with HTML/CSS/Javascript, we switched to those instead to focus more on developing the features of the app with the skills we were more comfortable with instead of spending too much time grappling with unfamiliar technologies.
> We managed to switch to ReactJS before the end of milestone 3.
* Working on securing our app - guarding against hacking attacks on the database
* Figuring out possible errors and handling them 
* Chrome would prompt a security error when entering the website; however, after changing the password hashing, the error went away.
* We were unable to implement all the extensions we had planned. We decided to focus on developing a sleeker and more intuitive UI as advised by one of the Orbital advisors instead of implementing all the extensions. 
> However, we did manage to implement the more important extensions.


## FAQ

**Q1: How will you perform quality-control and ensure that the material posted is accurate?**

A: Users from the community can suggest changes to the post if they find some inaccurate information and the uploader can rectify it accordingly through the update feature of posts.

Blatantly false/misleading information (eg. 1 + 1 = 4) should be reported by the community and admins will moderate the queue - 3 strikes before being banned from posting.

Other posts can be quality-controlled through the community dislike/like system so that users can tell if the post is reliable.

**Q2: Why is your app NUS-focused? Could it not, in theory, be used for any educational institute?**

A: We would like to begin with NUS since we are students here and have first-hand experience with learning here. It is also easier for us to gather information about modules and module codes to load into the database as tags. However, as a future extension, it is definitely possible to generalise our web app to be used for any educational institute.

**Q3: How can the database of information grow initially? How would this practically take off?**

A: Professors could consider incorporating contributions on Epiphany as an extra-credit grading scheme. They may be inclined to do so as this can help students learn better. See Question 4 below for more details.

**Q4: Why would lecturers/TAs want to incorporate Epiphany in their teaching?**

A: Firstly, the usage of such a learning platform would enable students to help educate their weaker peers, and in the process, strengthen their own learning. Weaker peers would also be able to receive help that is more easily digestible, whether be it due to the bite-sized content, or active learning. Learning through teaching others helps students learn better. For a new study in Applied Cognitive Psychology, researchers set out to test their theory that teaching improves the teacher’s learning because it compels the teacher to retrieve what they’ve previously studied. In other words, they believe the learning benefit of teaching is simply another manifestation of the well-known “testing effect” – the way that bringing to mind what we’ve previously studied leads to deeper and longer-lasting acquisition of that information than more time spent passively re-studying.
Secondly from point 5, profs would have more time to conduct one-on-one time with individual students. Since the information uploaded is available for future cohorts as well, even more time would be saved for these consults. Furthermore, by uploading resources on this platform, they can have a wide reach to help students and thus more efficiently use their time while helping more students. 


## Appendix

[Benefits of Microlearning](https://digitalmarketinginstitute.com/blog/7-reasons-to-use-microlearning-in-higher-education)

[How teaching others can help one learn better](https://journals.sagepub.com/doi/abs/10.3102/00028312019002237)
