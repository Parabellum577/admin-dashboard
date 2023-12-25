import React from 'react';
import Stack from '@mui/material/Stack';
import { CustomSelect, SearchInput } from 'components';
import { placeTypesOptions } from 'models/place';

type Props = {
  onSearchChange: (value: string) => void;
  onTypeSelect: (value: string) => void;
  searchValue: string;
  selectedType: string;
};

const PlacesFilters: React.FC<Props> = ({
  onSearchChange,
  searchValue,
  selectedType,
  onTypeSelect
}) => {

  return (
    <Stack
      width="90%"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Stack width="30%" maxWidth={300}>
        <CustomSelect
          label="Type"
          name="type"
          options={[{value: 'All', label: 'All'}, ...placeTypesOptions ]}
          value={selectedType}
          onChange={(e) => onTypeSelect(e.target.value)}
        />
      </Stack>
      <Stack width="30%" marginLeft={3} maxWidth={300}>
        <SearchInput
          className="filters-item"
          name="search"
          onChange={(v) => onSearchChange(v)}
          value={searchValue}
        />
      </Stack>
    </Stack>
  );
};

export default PlacesFilters;
