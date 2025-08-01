# Space Exploration Hub

A web-based visualization tool for displaying satellite locations and rocket launch data in real-time.\
Built with React, MaterialUI, Vite, and Three.js via the react-globe.gl library.

---

## Project Members

- **Anton (Anton-Pan)** - [Anton-Pan on GitHub](https://github.com/Anton-Pan)
- **Sadab (SadabKhan01)** - [SadabKhan01 on GitHub](https://github.com/SadabKhan01)
- **Bidisha (bidishaaroy)** - [bidishaaroy on GitHub](https://github.com/bidishaaroy)
- **Paul (pppaaaaul)** - [pppaaaaul onGitHub](https://github.com/pppaaaaul)

---

## APIs Used

### API #1: [Launch Library 2 (The Space Devs)](https://thespacedevs.com/llapi)

#### Feature 1: Time-Based Launch Filtering 
  View only the launches that happened during a time period of your choice. Launches are displayed as markers on a globe and include rich, interactive details.  

  **Instructions:**  
  1. Go to the top right of the website, and select the start and end search dates using the picker elements.  
  2. If you see a warning about invalid dates, your start and end dates are reversed.  
  3. Once both dates are valid, click the **Apply New Date Range** button.  
  4. The system will load matching launches and display them on the globe as flat red circles.

#### Feature 2: Interactive Launch Details Panel
  After selecting a date range, click on any flat red circle on the globe to view detailed information about that specific launch. The right-hand side panel will update to show comprehensive launch data, replacing the news feed.  

  **Instructions:**  
  1. Select a valid start and end date range using the date pickers at the top right and click **Apply New Date Range**.  
  2. Once launches load as red circles on the globe, click on one of them.  
  3. The launch info panel will display detailed information about your selected launch.

#### Feature 3: News Panel
  The news panel, as expected, shows the latest upcoming space-related news. 

  **Instructions:**  
  1. When the site loads, the news panel with displays on the right-hand side by default.  
  2. To return to the news panel after selecting a launch from the globe, click the **"Go back to news feed"** button located in the top-left interior corner of the right-hand panel.


### API #2: [Celestrak](https://celestrak.org/)

#### Feature 1: Brightest Satellites Display**
  Automatically collects the 100 brightest satellites from Celestrak and displays their real-time positions on the globe.  

  **Instructions:**  
  No user interaction is required, as the data loads and displays automatically upon site load.


---

## Local Installation And Running Instructions

1. **Get an IDE**  
   The most popular are [WebStorm](https://www.jetbrains.com/webstorm/) or [VS Code](https://code.visualstudio.com/)

2. **Install Node.js**  
   Download and install from [https://nodejs.org](https://nodejs.org), following their instructions.

3. **Clone the repository**
   ```
   git clone https://github.com/<your-repo>.git
   cd <your-project-folder>
   ```

4. **Install dependencies**
   ```
   npm install
   ```

5. **Start the development server**
   ```
   npm run dev
   ```
