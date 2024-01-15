import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./ChipsStyle.scss";
import { avatarUri, peopleNames } from "../constants";

const Chips = ({ chips: initialChips, max, maxlength, placeholder }) => {
  const [chips, setChips] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [INVALID_CHARS] = useState(/[^a-zA-Z0-9 ]/g);
  const KEY = {
    backspace: 8,
    tab: 9,
    enter: 13,
  };

  useEffect(() => {
    setChips(initialChips || []);
  }, [initialChips]);

  const fetchSuggestions = useCallback(
    (query) => {
      const staticSuggestions = [...peopleNames];

      const filteredSuggestions = staticSuggestions
        .filter((name) => name.toLowerCase().includes(query.toLowerCase()))
        .filter((name) => chips.indexOf(name) === -1);

      setSuggestions(filteredSuggestions);
    },
    [chips]
  );

  const onKeyDown = useCallback(
    (event) => {
      const keyPressed = event.which;

      if (
        keyPressed === KEY.enter ||
        (keyPressed === KEY.tab && event.target.value)
      ) {
        event.preventDefault();
        updateChips(event);
      } else if (keyPressed === KEY.backspace) {
        let chipsCopy = [...chips];

        if (!event.target.value && chipsCopy.length) {
          deleteChip(chipsCopy[chipsCopy.length - 1]);
        }
      }
    },
    [chips, KEY]
  );

  const clearInvalidChars = useCallback(
    (event) => {
      let value = event.target.value;

      if (INVALID_CHARS.test(value)) {
        event.target.value = value.replace(INVALID_CHARS, "");
      } else if (value.length > maxlength) {
        event.target.value = value.substr(0, maxlength);
      }
    },
    [INVALID_CHARS, maxlength]
  );

  const updateChips = useCallback(
    (event) => {
      if (!max || chips.length < max) {
        let value = event.target.value;

        if (!value) return;

        let chip = value.trim().toLowerCase();

        if (chip && chips.indexOf(chip) < 0) {
          setChips((prevChips) => [...prevChips, chip]);
        }
      }

      event.target.value = "";
      setSuggestions([]);
    },
    [chips, max]
  );

  const deleteChip = useCallback(
    (chip) => {
      const index = chips.indexOf(chip);

      if (index >= 0) {
        setChips((prevChips) => {
          let newChips = [...prevChips];
          newChips.splice(index, 1);
          return newChips;
        });
      }
    },
    [chips]
  );

  const handleSuggestionClick = useCallback((suggestion) => {
    setChips((prevChips) => [...prevChips, suggestion]);
    setSuggestions((prevSuggestions) =>
      prevSuggestions.filter((name) => name !== suggestion)
    );
  }, []);

  const focusInput = useCallback((event) => {
    const children = event.target.children;

    if (children.length) children[children.length - 1].focus();
  }, []);

  const renderedChips = useMemo(() => {
    return chips.map((chip, index) => (
      <span className="chip" key={index}>
        <span className="chip-value">
          <img
            className="chip-avatar"
            src={avatarUri}
            alt={`Avatar for ${chip}`}
          />
          {chip}
        </span>
        <button
          type="button"
          className="chip-delete-button"
          onClick={() => deleteChip(chip)}
        >
          x
        </button>
      </span>
    ));
  }, [chips, deleteChip]);

  const renderedSuggestions = useMemo(() => {
    return suggestions.map((suggestion, index) => (
      <div
        key={index}
        className="suggestion-item"
        onClick={() => handleSuggestionClick(suggestion)}
      >
        {suggestion}
      </div>
    ));
  }, [suggestions, handleSuggestionClick]);

  const renderedPlaceholder = useMemo(
    () => (!max || chips.length < max ? placeholder : ""),
    [max, chips, placeholder]
  );

  return (
    <div className="chips" onClick={focusInput}>
      {renderedChips}
      <input
        type="text"
        className="chips-input"
        placeholder={renderedPlaceholder}
        onKeyDown={onKeyDown}
        onKeyUp={clearInvalidChars}
        onChange={(e) => fetchSuggestions(e.target.value)}
      />
      {suggestions.length > 0 && (
        <div className="suggestion-list">{renderedSuggestions}</div>
      )}
    </div>
  );
};

export default Chips;
