import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import img_grid from "../assets/img_grid.png";
import Products from "../components/Products";
import CategoryComponent from "../components/Categories";
import DiscountBanner from "../components/DiscountBanner";
import NewArrivalBanner from "../components/NewArrivalBanner";
import { Box, Typography, Stack, Divider, Button } from "@mui/material";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../slices/productSlice";

const Home = () => {
  const products = useSelector((state) => state.product.getProducts.products).slice(0,8)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getProducts())
  }, [])
  const navigate = useNavigate();
  return (
    <>
      <Navbar />

      <NewArrivalBanner />

      <CategoryComponent limit={3} />
      <Box
        sx={{
          marginTop: "40px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          variant="outlined"
          sx={{
            borderColor: "#B88E2F",
            color: "#B88E2F",
            fontWeight: 600,
            width: "245px",
          }}
          onClick={() => navigate("/categories")}
        >
          Show More
        </Button>
      </Box>

      <Box sx={{ marginTop: "60px" }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "32px",
            textAlign: "center",
            color: "#3A3A3A",
          }}
        >
          Our Products
        </Typography>
      </Box>

      <Products products={products} />

      <Box
        sx={{
          marginTop: "40px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          variant="outlined"
          sx={{
            borderColor: "#B88E2F",
            color: "#B88E2F",
            fontWeight: 600,
            width: "245px",
          }}
          onClick={() => navigate("/shop")}
        >
          Show More
        </Button>
      </Box>

      <DiscountBanner />

      <Box>
        <Stack margin="10px" textAlign="center">
          <Typography
            color="#616161"
            sx={{
              fontWeight: "600",
              fontSize: { xs: "16px", sm: "18px", md: "20px" },
            }}
          >
            Share Your Setup With
          </Typography>
          <Typography
            color="#3A3A3A"
            sx={{
              fontWeight: "700",
              fontSize: { xs: "22px", sm: "32px", md: "40px" },
            }}
          >
            #Funiro Furniture
          </Typography>
        </Stack>

        <Box>
          <img src={img_grid} alt="" width="100%" />
        </Box>
      </Box>

      <Divider sx={{ margin: "50px 0 15px 0", borderBottomWidth: "2px" }} />

      <Footer />
    </>
  );
};

export default Home;
