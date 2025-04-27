import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import FAQs from './pages/FAQs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import AboutUs from './pages/AboutUs';
import NotFound from './pages/NotFound';

import HtmlBeautifier from './pages/code-formatting/HtmlBeautifier';
import JsBeautifier from './pages/code-formatting/JsBeautifier';
import CssBeautifier from './pages/code-formatting/CssBeautifier';
import JsMinifier from './pages/code-formatting/JsMinifier';
import CssMinifier from './pages/code-formatting/CssMinifier';
import JsonFormatter from './pages/code-formatting/JsonFormatter';

import JsonToYaml from './pages/utility-tools/JsonToYaml';
import TextCaseConverter from './pages/utility-tools/TextCaseConverter';
import PasswordChecker from './pages/utility-tools/PasswordChecker';

import SCOChecker from './pages/testing-tools/ScoChecker';
import HttpHeaderViewer from './pages/testing-tools/HttpHeaderViewer';
import JsonApiTester from './pages/testing-tools/JsonApiTester';

import Dashboard from "./pages/dashboard/Dashboard";
import Users from "./pages/dashboard/Users";
import Settings from "./pages/dashboard/Settings";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { LoginProvider, useLogin } from "./context/LoginContext";
import TokenVerifier from "./components/TokenVerifier";

const PrivateRoute = ({ element, adminOnly = false }) => {
  const { isAuthenticated } = useLogin();
  const userRole = localStorage.getItem("userRole");

  if (!isAuthenticated) return <Navigate to="/" />;
  if (adminOnly && userRole !== "admin") return <Navigate to="/dashboard" />;

  return element;
};

const AppRoutes = () => (
  <>
      <TokenVerifier />
    <ToastContainer position="top-right" autoClose={3000} />
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/faqs" element={<FAQs />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsConditions />} />
      <Route path="/about-us" element={<AboutUs />} />

      {/* Tools */}
      <Route path="/html-beautifier" element={<HtmlBeautifier />} />
      <Route path="/js-beautifier" element={<JsBeautifier />} />
      <Route path="/css-beautifier" element={<CssBeautifier />} />
      <Route path="/js-minifier" element={<JsMinifier />} />
      <Route path="/css-minifier" element={<CssMinifier />} />
      <Route path="/json-formatter" element={<JsonFormatter />} />
      <Route path="/json-to-yaml" element={<JsonToYaml />} />
      <Route path="/text-case-converter" element={<TextCaseConverter />} />
      <Route path="/password-checker" element={<PasswordChecker />} />
      <Route path="/seo-checker" element={<SCOChecker />} />
      <Route path="/http-header-viewer" element={<HttpHeaderViewer />} />
      <Route path="/json-api-tester" element={<JsonApiTester />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
      <Route path="/dashboard/settings" element={<PrivateRoute element={<Settings />} />} />
      <Route path="/dashboard/users" element={<PrivateRoute element={<Users />} adminOnly={true} />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Footer />

  </>
);

function App() {
  return (
    <LoginProvider>
      <Router>
        <AppRoutes />
      </Router>
    </LoginProvider>
  );
}

export default App;
