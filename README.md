# Emergency Note
CELESTRAK's SSL Certificate for their API endpoints has been expired as of 5 PM, August 6th, 2025. \
As the project is due at the end of the day, we are adding this note to inform the teaching team of the issue.\
If the project needs to be viewed, and the top-left corner shows an API Error or Loading alert (the issue will also be 
shown in the browser console as `ERR_CERT_COMMON_NAME_INVALID`), please go to your 
browser settings and add CELESTRAK.org to your exception list, or disable invalid SSL certificate warnings entirely.

---

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
  1. Go to the **top right** of the website, and select the start and end search dates using the **date picker elements**.  
  2. If you see a warning about invalid dates, your start and end dates are reversed.  
  3. Once both dates are valid, click the **Apply New Date Range** **button**.  
  4. The system will load matching launches and display them on the **globe** as **flat red circles**.

#### Feature 2: Interactive Launch Details Panel  
  After selecting a date range, click on any **flat red circle on the globe** to view detailed information about that specific launch. The **right-hand side panel** will update to show comprehensive launch data, replacing the **news feed**.  

  **Instructions:**  
  1. Select a valid start and end date range using the **date pickers at the top right** and click **Apply New Date Range** **button**.  
  2. Once launches load as **red circles** on the **globe**, **click** on one of them.  
  3. The **launch info panel** will display detailed information about your selected launch.

#### Feature 3: News Panel  
  The **news panel** shows the top 3 latest upcoming space-related pieces of news.

  **Instructions:**  
  1. When the site loads, the **news panel** will, by default, display on the **right-hand side**.  
  2. To return to the **news panel** after selecting a launch from the **globe**, click the **"Go back to news feed"** **button** located in the **top-left interior corner of the right-hand panel**.

---

### API #2: [Celestrak](https://celestrak.org/)

#### Feature 1: Brightest Satellites Display  
  Automatically collects the 100 brightest satellites from Celestrak and displays their real-time positions on the **globe**.  

  **Instructions:**  
  No user interaction is required, as the data loads and displays automatically upon site load.

#### Feature 2: Satellite Search and Focus  
  Quickly locate and track a specific satellite on the **globe**.

  **Instructions:**  
  1. Use the **search bar in the top-middle of the screen** to look up a satellite by name.  
  2. Select a satellite from the **list** to center the **globe** on its current position.  
  3. Click **Lock to Satellite** **button** to continuously follow the selected satellite as the timeline changes.  
  4. To unlock the view and regain manual control of the **globe**, click **Deselect Satellite & Unlock Globe** **button**.

#### Feature 3: Time-Based Satellite Movement  
  Explore how satellite positions change over time using a **vertical time slider**.

  **Instructions:**  
  1. Drag the **vertical slider on the left side of the screen** to move forward or backward in time (**up** for future, **down** for past).  
  2. The **slider** supports **minute-level precision** and covers a full 7-day range in both directions.  
  3. Key time points are labeled (e.g., **"-3 days"**, **"Today"**, **"+2 days"**) for easier navigation.  
  4. Return the **slider** to **"Today"** to view satellites in their current real-time positions.

---

## Local Installation And Running Instructions

1. **Get an IDE**  
   The most popular are [WebStorm](https://www.jetbrains.com/webstorm/) and [VS Code](https://code.visualstudio.com/), but feel free to pick an alternative - these instructions are IDE-agnostic.

2. **Install Node.js**  
   Download and install from [https://nodejs.org](https://nodejs.org), following their instructions.

3. **Clone the repository**
   ```
   git clone https://github.com/CMPT-276-SUMMER-2025/final-project-11-stars.git
   cd final-project-11-stars 
   ```
	*(Note: Some IDEs will automatically place you into the root directory of the project folder. Double-check before running the `cd` command, as you might not need to use it.)*

4. **Install dependencies**
   ```
   npm install
   ```

5. **Start the development server**
   ```
   npm run dev
   ```

6. **Go to the website**\
    In your IDE console, you will see a message similar to the onme shown below.	
    ```
   ➜  Local:   http://localhost:<...>/<___>
   ➜  Network: use --host to expose
   ➜  press h + enter to show help
    ```
   Copy the `http://localhost:<...>` line of text, where `...` represents a **3-5 digit sequence of numbers** and `___` represents a (potentially-present) string. \
   Usually, it will appear as `http://localhost:5173/final-project-11-stars`, but make sure to copy the link shown in **YOUR** IDE!

7. Open up your preferred web browser, paste it into the search bar and press enter.

8. Enjoy the site!