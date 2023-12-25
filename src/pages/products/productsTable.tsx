import { FC } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ContextMenu, ReactLoader, StyledTableCell, StyledTableRow } from 'components';
import { ProductType } from 'models/product';
import { renderCurrency } from 'utils/currency';
import { productTypeOptions } from 'models/product';

type TableHeadCell = {
  label: string;
};

const TABLE_HEAD: TableHeadCell[] = [
  {
    label: 'Product name',
  },
  {
    label: 'Price',
  },
  {
    label: 'Type',
  },
  {
    label: 'Actions',
  },
];

type Props = {
  loading?: boolean;
  products: ProductType[];
  total: number;
  loadMore: () => void;
  onDelete: (id: string) => void;
  handleEditProduct: (product: ProductType | null) => void;
};

const mainTextStyles = {
  color: '#1E1E70',
  fontSize: '12px',
};

const ProductsTable: FC<Props> = ({
  loading,
  products,
  handleEditProduct,
  loadMore,
  onDelete,
  total
}) => {

  const getProductTypeLabel = (type: string) => {
    return productTypeOptions.find((e) => e.value === type)
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 'none' }}>
      {loading && !products.length ? (
        <Stack alignItems="center" direction="column" marginTop={2}>
          <ReactLoader />
        </Stack>
      ) : (
        <TableContainer sx={{ maxHeight: '69vh' }}>
          <Table aria-label="customized table" stickyHeader>
            <TableHead>
              <StyledTableRow>
                {TABLE_HEAD.map((item) => (
                  <StyledTableCell key={item.label} align="left">
                    <Typography sx={{ ...mainTextStyles, fontWeight: 700 }}>
                      {item.label}
                    </Typography>
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <StyledTableRow key={product._id}>
                  <StyledTableCell sx={mainTextStyles} align="left">
                    {product.name}
                  </StyledTableCell>
                  <StyledTableCell sx={mainTextStyles} align="left">
                    {`${renderCurrency(product.pricing?.public?.currency)} ${
                      product.pricing?.public?.price / 100
                    }`}
                  </StyledTableCell>
                  <StyledTableCell sx={mainTextStyles} align="left">
                    {getProductTypeLabel(product.type)?.label}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <ContextMenu
                      options={[
                        {
                          label: 'Edit product',
                          onClick: () => handleEditProduct(product),
                        },
                        { label: 'Delete product', onClick: () => onDelete(product._id) },
                      ]}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {total && products?.length < total ? (
        <Button onClick={loadMore} variant="contained" color="primary" fullWidth>
          Load more
        </Button>
      ) : null}
    </Paper>
  );
};

export default ProductsTable;
