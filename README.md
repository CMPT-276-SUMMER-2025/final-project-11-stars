1) Git is a free, distributed version control system that keeps track of versions of its files and helps one manage their project’s version history. GitHub is a cloud-based repository where users can share and collaborate on code by using the Git version control system to keep track of changes across versions.

2) A distributed version control system is a kind of version control where the complete codebase and its history are mirrored on every developer’s computer, which allows developers to collaborate efficiently.

3) The three states in Git are:
● Working Directory:
 The project folder, where the user stores all files they see and edit. Any edits made here haven’t yet been recorded by Git.


● Staging Area:
It is the index, where, using git add, the user stores information of what will go into the next commit. Staged changes go into the next commit.


● Repository (HEAD):
This is the committed history that is stored in git. After running the command git commit, staged changes are stored here and become part of the project’s version history. When you run git commit, staged changes move here and become part of your project’s timeline. The HEAD moves when a commit is made.

4) ● git clone: It points to an existing repository and makes a copy of that repository with its full history in a new local directory.


● git status: This shows the state of the working directory and the staging area. It displays which changes have been staged, which haven't, which files are untracked, altered, ahead or behind compared to the current branch’s remote.

● git fetch: This command downloads content (commits and refs) from a remote repository into the user’s local repository’s remotes. It does so without changing the working tree.

● git init: This command creates a new, empty Git repository in the current directory (it can also be used to turn an existing, unversioned project into a Git repository)

● git log: This command displays committed snapshots of the current branch in reverse order. It lets the user list the project history and search for specific changes

5) A .gitignore file contains the list of files and folders Git should ignore (not track), as in not show as untracked or include in commits. This keeps unnecessary files out of version control.
Here’s some new README text
Here’s some new README text
