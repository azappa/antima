#### but first... why another static site generator?
The reason is well explained [into this post on Medium](https://medium.com/@rrhoover/build-for-fun-%E3%81%A3-%E3%81%A3-c7864e58a8a0). We tried a lot of ssg but no one satisfies _directly_ our needs, we tweaked them a lot of times, maybe to implement tools we use everyday (_jade + stylus_) is a pain in the ass and things like these.


#### Usage
Antima requires the folder name where sources and templates are, in this example "projects" (_template_ argument is not optional)
```
node antima.js --template projects
```


#### Tree structure
When using antima you need to create this tree structure (if you're using _projects_ as folder name)

    projects  
    | source  
    | | my-first-project.yaml  
    | template  
    | | projects.jade    
