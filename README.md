## Antima
> Gravity (グラビデ, Gurabide?), also known as Demi, is a recurring fractional damage spell from the Final Fantasy series. In a few games it appears in, its a Gravity-elemental spell. It cuts an enemy's HP by a specific amount, usually by 50% or 25%, although this depends on the game. The number of targets it affects is also game dependent.
>
> ![](http://vignette3.wikia.nocookie.net/finalfantasy/images/e/ed/FFX_Demi.png/revision/latest?cb=20111222035851)
>
> __Antima__ is the translation of english term Gravity (or Demi in _Final Fantasy X).


#### but first... why another static site generator?
The reason is well explained [into this post on Medium](https://medium.com/@rrhoover/build-for-fun-%E3%81%A3-%E3%81%A3-c7864e58a8a0). We tried a lot of ssg but no one satisfies _directly_ our needs, we tweaked them a lot of times, maybe to implement tools we use everyday (_pug + stylus_) is a pain in the ass and things like these.


#### Usage
Antima requires the folder name where sources and templates are, in this example "projects" (_template_ argument is not optional)
```
node antima.js --template projects
```
In that folder also add a file called `sitemap.config.json` with the keys you need for your sitemap links, for example:
```
{ 
  "keys": ["title", "coverImage"]
}
```


#### Tree structure
When using antima you need to create this tree structure (if you're using _projects_ as folder name)

    projects  
    | source  
    | | my-first-project.yaml  
    | template  
    | | projects.jade    
    | | sitemap.config.json    


_Note_: if you are using *jade* instead *pug* please refer to `0.12` branch.