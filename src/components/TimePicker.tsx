import React, { useState } from "react";
import Select, { SingleValue } from "react-select";
import moment from "moment";

type TimePickerProps = {
  value?: moment.Moment;
  onChange?: (value: moment.Moment) => void;
};

type SelectOptionType = SingleValue<{ value: number, label: string; }>;

const hours = Array.from({ length: 24 }, (_, i) => ({ value: i, label: moment().hour(i).format("HH") }));
const minutes = Array.from({ length: 60 }, (_, i) => ({
  value: i,
  label: moment().minute(i).format("mm")
}));

const TimePicker: React.FC<TimePickerProps> = ({ onChange, value }) => {
  const [selectedHour, setSelectedHour] = useState<number | null>(value ? value.hour() : null);
  const [selectedMinute, setSelectedMinute] = useState<number | null>(value ? value.minute() : null);

  const handleChangeHour = (option: SelectOptionType) => {
    const hours = option?.value ?? 0;
    setSelectedHour(hours);

    const newDateTime = moment(value);
    newDateTime.set({
      hours: hours || 0,
      minutes: selectedMinute || 0,
      seconds: 0
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
      seconds: 0
    });
    onChange && onChange(newDateTime);
  };

  return (
    <div className="grid gap-1 grid-cols-2">
      <Select
        className="col-span-1"
        value={hours.find((option) => option.value === selectedHour)}
        onChange={handleChangeHour}
        options={hours}
        placeholder="HH"
      />

      <Select
        className="col-span-1"
        value={minutes.find((option) => option.value === selectedMinute)}
        onChange={handleChangeMinute}
        options={minutes}
        placeholder="mm"
      />
    </div>
  );
};

export default TimePicker;

