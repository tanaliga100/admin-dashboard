import { Box, Divider, Typography } from "@mui/material";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Hero from "../components/shared/Hero";
import Search from "../components/shared/Search";
import { FlexRowWrapper } from "../components/wrapper/Wrapper";
import { useGetTransactionsQuery } from "../state/api";

const TransactionsLayout = () => {
  // get the search Value

  // get the params value
  const [page, setPage] = useState<number | any>(0);
  const [pageSize, setPageSize] = useState<number | any>(20);
  const [sort, setSort] = useState<string | any>({});
  const [search, setSearch] = useState<string | any>("");

  // call the api
  const data = useGetTransactionsQuery(
    {
      page,
      pageSize,
      sort: JSON.stringify(sort),
      search,
    },
    undefined
  );

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
  };
  return (
    <Box>
      <FlexRowWrapper flexGrow={1} sx={{ justifyContent: "left", gap: "3rem" }}>
        <Hero
          title="TRANSACTIONS"
          subtitle="List of all the Transactions"
          isLoading={data ? data.isLoading : false}
          counts={data?.data?.counts}
        />
        <Search
          label="Search Transactions"
          value={search}
          getValue={changeHandler}
        />
        <Typography color="tan" variant="h1" p={5} textAlign="end">
          @tanaliga[73]
        </Typography>
      </FlexRowWrapper>
      <Divider light />
      <Outlet context={data && data?.data} />
    </Box>
  );
};

export default TransactionsLayout;
