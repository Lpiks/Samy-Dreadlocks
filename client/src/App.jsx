import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';

function App() {
    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    {/* Placeholders for other routes */}
                    <Route path="/services" element={<div className="container" style={{ padding: '5rem 0' }}><h1>Services Page</h1></div>} />
                    <Route path="/gallery" element={<div className="container" style={{ padding: '5rem 0' }}><h1>Gallery Page</h1></div>} />
                    <Route path="/booking" element={<div className="container" style={{ padding: '5rem 0' }}><h1>Booking Page</h1></div>} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
