import React from 'react';
import Stack from '@mui/material/Stack';
import { SearchInput } from 'components';

type Props = {
  onSearchChange: (value: string) => void;
  searchValue: string;
};

const ProductsFilters: React.FC<Props> = ({
  onSearchChange,
  searchValue,
}) => {
  return (
    <Stack flexDirection="row" alignItems="center">
      <SearchInput
        name="search"
        onChange={(v) => onSearchChange(v)}
        value={searchValue}
      />
    </Stack>
  );
};

export default ProductsFilters;
