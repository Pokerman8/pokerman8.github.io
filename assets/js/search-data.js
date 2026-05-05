// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "Publications",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-blog",
          title: "Blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "post-wearable-medical-devices-and-personal-health-data",
        
          title: "Wearable Medical Devices and Personal Health Data",
        
        description: "Why continuous personal health data may become a foundation for truly personalized medicine.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/brainstorm-log/";
          
        },
      },{id: "post-a-weekly-fitness-check-in",
        
          title: "A Weekly Fitness Check-In",
        
        description: "a simple place to track routines, consistency, and training reflections",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/weekly-fitness-check-in/";
          
        },
      },{id: "post-building-better-game-guides",
        
          title: "Building Better Game Guides",
        
        description: "notes on writing clear walkthroughs, strategies, and gameplay tips",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/building-better-game-guides/";
          
        },
      },{id: "post-how-i-use-this-technical-notebook",
        
          title: "How I Use This Technical Notebook",
        
        description: "a short note on the kind of technical writing I want to keep here",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/technical-notebook/";
          
        },
      },{id: "post-a-post-with-videos",
        
          title: "a post with videos",
        
        description: "this is what included videos could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/videos/";
          
        },
      },{id: "post-a-post-with-math",
        
          title: "a post with math",
        
        description: "an example of a blog post with some math",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2015/math/";
          
        },
      },{id: "post-a-post-with-code",
        
          title: "a post with code",
        
        description: "an example of a blog post with some code",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2015/code/";
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-sparkles-smile-after-a-long-time-of-struggling-i-finally-decided-to-create-my-personal-website",
          title: ':sparkles: :smile: After a long time of struggling, I finally decided to create...',
          description: "",
          section: "News",},{id: "news-a-paper-accepted-by-the-visual-computer-international-journal-of-computer-graphics-2025",
          title: 'A paper accepted by The Visual Computer International Journal of Computer Graphics 2025...',
          description: "",
          section: "News",},{id: "news-new-project-skel-cf-a-biomechanical-skeleton-and-surface-mesh-recovery-framework",
          title: 'New project SKEL-CF: a biomechanical skeleton and surface mesh recovery framework.',
          description: "",
          section: "News",},{id: "projects-project-1",
          title: 'project 1',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_project/";
            },},{id: "projects-project-2",
          title: 'project 2',
          description: "a project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_project/";
            },},{id: "projects-project-3-with-very-long-name",
          title: 'project 3 with very long name',
          description: "a project that redirects to another website",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_project/";
            },},{id: "projects-project-4",
          title: 'project 4',
          description: "another without an image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_project/";
            },},{id: "projects-project-5",
          title: 'project 5',
          description: "a project with a background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/5_project/";
            },},{id: "projects-project-6",
          title: 'project 6',
          description: "a project with no image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/6_project/";
            },},{id: "projects-project-7",
          title: 'project 7',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/7_project/";
            },},{id: "projects-project-8",
          title: 'project 8',
          description: "an other project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/8_project/";
            },},{id: "projects-project-9",
          title: 'project 9',
          description: "another project with an image 🎉",
          section: "Projects",handler: () => {
              window.location.href = "/projects/9_project/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%70%6F%6B%65%72%6D%61%6E%31%33%6A%6A%70@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=bwKzizwAAAAJ", "_blank");
        },
      },];
