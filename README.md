# course-curriculum-graph / ccgraph

This web app shows a graph of university courses, topics included in the courses, and lets students rate the topics, reflect on them, and connect topics of different courses. This is an MVP for University of Helsinki.

Some features:
* shows student a graph of courses the student is taking
* shows topics / course curriculum / bla associated with the courses
* lets the student rate the topics
* lets the student comment on the topics
* lets the student connect topics from different courses
* etc.

The front-end is done with VueJS. There will be a simple backend in Django.

The system will be based on some sort of event sourcing model where the state and all actions may be logged into the backend and constructed in the front-end making some sort of time travel possible.
