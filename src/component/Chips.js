import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./ChipsStyle.scss";
const imgUri =
  "https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg";
const Chips = ({ chips: initialChips, max, maxlength, placeholder }) => {
  const [chips, setChips] = useState([]);
  const [INVALID_CHARS] = useState(/[^a-zA-Z0-9 ]/g);
  const KEY = {
    backspace: 8,
    tab: 9,
    enter: 13,
  };

  useEffect(() => {
    setChips(initialChips || []);
  }, [initialChips]);

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
            src={imgUri}
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
      />
    </div>
  );
};

export default Chips;
