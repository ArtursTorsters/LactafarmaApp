<img src="http://lactafarma.bebemundi.com/lactafarma.jpg" align="right" style="height: 100px"/>

# Lactafarma API
Here is the documentation about API created for Lactafarma mobile app, for getting started you might be able to get information about:

* Groups of drugs which are divided by family
* Aliases used by drug, on this way you will be aware about different naming for any drug
* Brands around every drug, which it's interesting for getting drugs more cheaper than private ones
* Drugs with detailed information about risk when you are making breastfeeding (this information is extracted from <a href="www.e-lactancia.org" target="_blank">www.e-lactancia.org</a>)
* Alerts about updates on drug information or new risk level

## Technical Information
This project was developed for getting knowledge on .NET Core platform using MVC6, the implementation has a lot of scenarios for real API implementations on ASP.NET Core paradigm, main problems were solved on this project are:

1. Cookie Authentication
2. Extending ASP.NET Core Identity
3. Entity Framework Core 2.0
4. FluentApi on Entity Framework Core
5. .NET Core 2.0
6. MVC6. 
7. Repository pattern
8. NLog tracing exceptions
9. IMemoryCache support
10. Dependency injection native support
11. Custom routing for versioning
12. Error handling and tracking for incorrect requests
13. Disabling default routes
14. Filtering data by user requests (IHttpAccessor)
15. Extending ClaimsPrincipal for customizing UserIdentity entity
16. Register new users
17. Login existing users
18. Supporting Language resolving
19. Custom Paging and Ordering for huge number of items is retrieved
20. Deal with migrations on NLayer solution for UserIdentity SQL scripts generation

> Note: It's important to mention that Visual Studio 2017 15.3 update is used as IDE for developing and SQL Server 2014 for storing data, also best practices on coding were customized using ReSharper (new File Layout).


### Solution structure
On my projects typically is used the N-Layer Onion architecure approach, in some cases Domain Driven Design is intended to be applied, so always Domain layer has a lot of responsability for dealing with Front-Back layers, so the full picture is the following:

<img src="http://lactafarma.bebemundi.com/projectstructure.png" align="center" style="height: 300px"/>

#### LactafarmaAPI
Web project with business logic about Startup services configuration (middleware), Controllers, bower packages, general settings...

#### LactafarmaAPI.Services
Proxy project for getting requests on Web and passing out this information on Repositories.

#### LactafarmaAPI.Domain
Domain core project where domain objects are stored, kind of agreement with analysts or business users. 

#### LactafarmaAPI.Data
EntityFramework Core 2.0 project, where DbContext is configured and all entities are registered and mapped with FluentAPI provided by EF.

#### LactafarmaAPI.Core
Generic implementations or helpers ready to be used by rest of projects, kinda framework approach.

#### LactafarmaAPI.EntityFrameworkMigrations
This project was a workaround for dealing with IdentityUser object on environments with dependency injection on class library project (which resides EF Core)

### Tryout Swagger API documentation
A customized API documentation with Swagger is available for you, everything needed for creating qualified, accurated & elegant website under ASP.NET Core 2 paradigm is also available on the repository.

> **NEW HEADER**
<img src="http://lactafarma.bebemundi.com/images/lactafarma-swagger-header.png" align="center" />

> **XML DOCUMENTATION ENABLED BY ENTITY**
<img src="http://lactafarma.bebemundi.com/images/lactafarma-swagger-entities.png" align="center" />

> **SWASHBUCKLE NUGET PACKAGE ON ASP.NET CORE 2.0**
<img src="http://lactafarma.bebemundi.com/images/lactafarma-swagger-description.png" align="center" />

**If you want to see more, please visit us on following link: **<a href="http://lactafarma.bebemundi.com/help"  target="_blank">LactafarmaApi Help Documentation</a>****

### Problems? Please let us know

If you run into any problems or issues, **please** let us know so we can address and fix them right away. You can report issues on GitHub:

* [LactafarmaAPI Bug Reports and Feature Requests](https://github.com/gomnet/lactafarma/issues)

