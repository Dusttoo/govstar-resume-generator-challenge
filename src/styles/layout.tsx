import Header from "@/components/layout/Header/Header";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import * as React from "react";

export type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box display="flex" minHeight="100vh" flexDirection="column">
      <Header />

      <Container component="main" maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
        {children}
      </Container>

      <Box component="footer" sx={{ borderTop: 1, borderColor: "divider", py: 2 }}>
        <Container maxWidth="lg" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} GovStar Resume Generator
          </Typography>
          <Typography variant="caption" color="text.secondary">
            v0.1.0
          </Typography>
        </Container>
      </Box>
    </Box >
  );
}
