
This is a simple terminal-based simulation of resource allocation game.

The game runs for four iterations of the game in a 10*10 grid.

User inputs are simulated with 10% of cells tested, and 5% containment in every step.

Tested cells are visualzed with * like \*red\*, and disconnected cells are
visualized with [] like [red].

Steps to run the game on the console/terminal:
1) Install node
2) Open terminal or npm console in windows
3) Navigate to the folder
4) Run> node index.js
5) Open browser: https://localhost:3002

<!-- 4) > node graphs.js number_cells n_iterations, disconnection%, testing% -->


To be clear on the rules
1) testing means that it is testing + quarantine: continues to influennce the cells state, until is reconnected
2) disconnect means that the cell does not influence neighbouring cells
3) connect stops testing, and disconnection and resumes normal activity


Some initial thoughts on playing the first version of the game:

1) Without containment that game moves to red cells in two steps

2) We have to set the starting configuraiton of the game such that some regions
are already contained and there are still resources available to use - and where
testing is being done

3) This could mirror the actual data from the city' administration,

4) In this way, players will not be start from a clean slate, but start out with
an existing city in crisis. This will be much more accurate to current context
in which the game is used.
