import moment from "moment";
import React, { useState, useEffect } from "react";
import Select, { SingleValue } from "react-select";

type TimePickerProps = {
  value?: moment.Moment;
  onChange?: (value: moment.Moment) => void;
};

type SelectOptionType = SingleValue<{ value: number; label: string }>;

const generateOptions = (length: number, formatFunc: (i: number) => string) =>
  Array.from({ length }, (_, i) => ({ value: i, label: formatFunc(i) }));

const TimePicker: React.FC<TimePickerProps> = ({ onChange, value }) => {
  const [selectedHour, setSelectedHour] = useState<number | null>(
    value ? value.hour() : null
  );
  const [selectedMinute, setSelectedMinute] = useState<number | null>(
    value ? value.minute() : null
  );

  const currentHour = moment().hour();
  const currentMinute = moment().minute();

  const hours = generateOptions(24, (i) => moment().hour(i).format("HH"));
  const minutes = generateOptions(60, (i) => moment().minute(i).format("mm"));

  const filteredHours = hours.filter((option) => {
    if (selectedHour !== null && value && value.isSame(moment(), "day")) {
      return option.value >= currentHour;
    }
    return true;
  });

  const filteredMinutes = minutes.filter((option) => {
    if (
      selectedHour === currentHour &&
      value &&
      value.isSame(moment(), "day")
    ) {
      return option.value >= currentMinute;
    }
    return true;
  });

  const handleChangeHour = (option: SelectOptionType) => {
    const hours = option?.value ?? 0;
    setSelectedHour(hours);

    const newDateTime = moment(value);
    newDateTime.set({
      hours: hours || 0,
      minutes: selectedMinute || 0,
      seconds: 0,
    });
    onChange && onChange(newDateTime);
  };

  const handleChangeMinute = (option: SelectOptionType) => {
    const minutes = option?.value ?? 0;
    setSelectedMinute(minutes);

    const newDateTime = moment(value);
    newDateTime.set({
      hours: selectedHour || 0,
      minutes: minutes || 0,
      seconds: 0,
    });
    onChange && onChange(newDateTime);
  };

  return (
    <div className="grid gap-1 grid-cols-2">
      <Select
        className="col-span-1"
        value={filteredHours.find((option) => option.value === selectedHour)}
        onChange={handleChangeHour}
        options={filteredHours}
        placeholder="HH"
      />
      <Select
        className="col-span-1"
        value={filteredMinutes.find(
          (option) => option.value === selectedMinute
        )}
        onChange={handleChangeMinute}
        options={filteredMinutes}
        placeholder="mm"
        isDisabled={selectedHour === null} // Disable minutes select until an hour is selected
      />
    </div>
  );
};

export default TimePicker;
