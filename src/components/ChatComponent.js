import React, { useState } from "react";
import axios from "axios";
import { Input } from "antd";

const { Search } = Input;

// axios: call backend api by front end

// backend domain
const DOMAIN = process.env.REACT_APP_DOMAIN;

const searchContainer = {
  display: "flex",
  justifyContent: "center",
};

const ChatComponent = (props) => {
  const { handleResp, isLoading, setIsLoading } = props;
  // Define a state variable to keep track of the search value
  const [searchValue, setSearchValue] = useState("");

  const onSearch = async (question) => {
    // Clear the search input
    setSearchValue("");
    setIsLoading(true);

    try {
      const response = await axios.get(`${DOMAIN}/chat`, {
        params: {
          question,
        },
      });
      handleResp(question, response.data);
    } catch (error) {
      console.error(`Error: ${error}`);
      handleResp(question, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    // Update searchValue state when the user types in the input box
    setSearchValue(e.target.value);
  };

  return (
    <div style={searchContainer}>
      <Search
        placeholder="Please ask your question"
        enterButton="Enter"
        size="large"
        onSearch={onSearch}
        loading={isLoading}
        value={searchValue} // Control the value
        onChange={handleChange} // Update the value when changed
      />
    </div>
  );
};

export default ChatComponent;