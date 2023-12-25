import React, { useCallback, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { SxProps, Theme } from '@mui/material/styles';
import { downArrow } from 'assets/svg';
import Autocomplete from '@mui/material/Autocomplete';
import { isArray } from 'lodash';
import Chip from '@mui/material/Chip';

export type AutoSelectOptionType = { label: string; value: string };

type Props = {
  value: string | string[];
  options: AutoSelectOptionType[];
  label: string;
  onChange: (value: string | string[]) => void;
  sx?: SxProps<Theme>;
  multiple?: boolean;
  name?: string;
};

const CustomAutocomplete: React.FC<Props> = ({
  options,
  onChange,
  value,
  label,
  sx,
  multiple = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const getSelected = useCallback(() => {
    if (isFocused && !multiple) return;
    if (isArray(value)) {
      return options.filter((item) => value.includes(item.value));
    } else {
      return options.find((opt) => opt.value === value);
    }
  }, [options, value, isFocused]);

  return (
    <Autocomplete
      multiple={multiple}
      sx={sx}
      value={getSelected()}
      onChange={(event, newValue) => {
        if (isArray(newValue)) {
          onChange(newValue.map((v) => v.value));
        } else {
          onChange(newValue.value);
        }
      }}
      disableClearable={true}
      options={options}
      getOptionLabel={(option: AutoSelectOptionType) => option.label}
      renderOption={(props, option) => <li {...props}>{option.label}</li>}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      popupIcon={
        <img
          style={{
            padding: '8px',
            backgroundColor: 'transparent',
            right: '18px',
            top: 'calc(50% - 0.4em)',
          }}
          src={downArrow}
          alt=""
        />
      }
      renderInput={(params) => (
        <TextField
          {...params}
          value={isArray(value) ? value.join(',') : value}
          label={label}
        />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            label={option.label}
            {...getTagProps({ index })}
            sx={{
              marginRight: '5px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(30, 30, 112, 0.05)',
            }}
          />
        ))
      }
    />
  );
};

export default CustomAutocomplete;
