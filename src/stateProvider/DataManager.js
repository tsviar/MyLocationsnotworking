import React, { useState, useEffect } from "react";
//import robots_data from "../robots-data.json";

import * as api from "../services/ProfileSevice";

const data_url = "https://api.myjson.com/bins/yt3d9";

const StateDataManager = React.createContext();
const { Provider } = StateDataManager;

const WrapperDataManager = ({ children }) => {
  console.log(`in WrapperDataManager`);

  const [original_list, set_original_list] = useState([]);
  const [filtered_list, update_filtered_list] = useState([]);
  const [selected_card, update_selected_card] = useState({});
  const [loading_profiles, set_loading_profiles] = useState(true);
  const [error_message, set_error_message] = useState(null);

  const states = {
    original_list, //: robots_data,
    filtered_list, //: robots_data,
    selected_card, //: robots_data[0]
    loading_profiles,
    error_message
  };

  const actions = {
    set_original_list,
    update_filtered_list,
    update_selected_card,
    set_loading_profiles,
    set_error_message
  };

  // The effect hook called useEffect is used to fetch the data from the API
  // The promise resolving happens with async/await.

  async function fetchData(data_url) {
    try {
      const web_list = await api.fetchAllProfiles3(data_url);

      console.log(`MANAGER fetchData web_list:`);
      console.table(web_list);

      console.log(`MANAGER fetchData calling setWebList:`);
      if (web_list) {
        console.log(`MANAGER fetchData weblist valid:`);
        console.table(web_list);

        set_original_list(web_list);
        update_filtered_list(web_list);
        update_selected_card(web_list[0]);
        set_loading_profiles(false);

        console.log(`MANAGER fetchData web_list[0]:`);
        console.log(web_list[0]);
      } else {
        console.log(`MANAGER fetchData weblist NOT valid:`);
        set_error_message(`MANAGER fetchData weblist NOT valid:`);
        /*
        set_original_list(robots_data);
        update_filtered_list(robots_data);
        update_selected_card(robots_data[0]);
        set_loading_profiles(false);
        */
      }
    } catch (err) {
      set_error_message(err.message);
    }
  }

  useEffect(() => {
    console.log(`useEffect calling fetchData`);
    fetchData(data_url);

    // We only want to fetch data when the component mounts.
    // That’s why you can provide an empty array as second argument
    // to the effect hook
    // to avoid activating it on component updates
    // but only for the mounting of the component.
  }, []);

  // WrapperDataManager adds a top Provider layer to ProfilesBrowser and all the tree ({children})
  return <Provider value={{ ...states, ...actions }}>{children}</Provider>;
};

export { WrapperDataManager, StateDataManager };
