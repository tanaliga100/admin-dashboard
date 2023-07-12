// import { getCountryIso3 } from "country-iso-2-to-3";
import { NextFunction, Request, Response } from "express";
import Product from "../models/product.model";
import ProductStat from "../models/productStats.model";
import Transaction from "../models/transaction.model";
import User from "../models/user.model";

export const GET_PRODUCTS = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // GET THE PRODUCTS
    const products = await Product.find({});
    if (!products) {
      res.status(404).json({ message: "Product not found" });
    }
    // GET THE PRODUCT STATS
    const productWithStats = await Promise.all(
      products.map(async (product) => {
        const stats = await ProductStat.find({
          productId: product._id,
        });
        return {
          ...product.toObject(),
          stats,
        };
      })
    );

    res.status(200).json({
      message: "All Products",
      counts: products.length,
      // products: products,
      productWithStats: productWithStats,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(404).json({ message: error.message });
    }
    res.status(404).json({ message: "Unknown error occured!" });
  }
};

export const GET_CUSTOMERS = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customers = await User.find({ role: "user" }).select("-password");
    if (!customers) {
      return res.status(404).json({ message: "No customers" });
    }
    res
      .status(200)
      .json({ message: "All Users", counts: customers.length, customers });
  } catch (error) {
    return res.status(500).json({ message: " Error occured" });
  }
};

export const GET_TRANSACTIONS = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body, req.query);
  try {
    // query strings from FE;
    // TYPES
    interface QueryString {
      page?: number;
      pageSize?: number;
      sort?: string | number | null;
      search?: string;
    }
    const {
      page = 1,
      pageSize = 20,
      sort = null,
      search = "",
    }: QueryString = req.query;

    const generateSort = () => {
      const sortParsed = JSON.parse(sort as string);
      const sortFormatted = {
        [sortParsed.field]: sortParsed.sort === "asc" ? 1 : -1,
      };
      return sortFormatted;
    };
    const sortFormatted = Boolean(sort) ? generateSort() : {};
    const transactionsLength = (await Transaction.find({})).length;

    const transactions = await Transaction.find({
      $or: [
        {
          cost: { $regex: new RegExp(search, "i") },
          userId: { $regex: new RegExp(search, "i") },
        },
      ],
    })
      .sort(sortFormatted as {})
      .skip(page * pageSize)
      .limit(pageSize);

    res.status(200).json({
      msg: "ALL TRANSACTIONS",
      counts: transactionsLength,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ message: " Error occured" });
  }
};

export const GET_GEOGRAPHY = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // grab the user and select the id
    const users = await User.find({}).select("city state country role");
    // const mappedLocation = users.reduce((acc: any, country: any) => {
    //   const countryISO = getCountryIso3(country);
    //   if (!acc[country]) {
    //     acc[countryISO] = 0;
    //   }
    //   acc[countryISO]++;
    //   return acc;
    // }, {});

    // final format
    // const formattedLocation = Object.entries(mappedLocation).map(
    //   (country, count) => {
    //     return {
    //       id: country,
    //       value: count,
    //     };
    //   }
    // );
    // console.log("MAPPED", mappedLocation);

    res.status(200).json({ msg: "GEO", counts: users.length, users });
  } catch (error) {}
};
