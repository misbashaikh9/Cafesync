import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext.jsx';
import { useAuth } from './AuthContext.jsx';

const ProductSuggestionsSection = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, token } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('wishlist');
  const [recommendations, setRecommendations] = useState({
    wishlist: [],
    buyAgain: [],
    recommended: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Get user info from useAuth
  const userId = user?.userId || user?._id;

  // Debug user authentication state
  useEffect(() => {
    console.log('User state changed:', user);
    console.log('User ID from useAuth:', user?.userId || user?._id);
    console.log('User ID from token:', userId);
    console.log('User email:', user?.email);
  }, [user, userId]);

  // Fetch wishlist products from database
  const fetchWishlist = async () => {
    if (!userId || !token) {
      console.log('No user ID or token found, returning empty wishlist');
      return [];
    }
    
    try {
      console.log('Fetching wishlist with token:', token ? 'Token exists' : 'No token');
      
      const response = await fetch('http://localhost:3001/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Wishlist response status:', response.status);
      console.log('Wishlist response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`Failed to fetch wishlist: ${response.status}`);
      }

      const wishlistData = await response.json();
      console.log('Raw wishlist data:', wishlistData);
      
             // Transform wishlist data to match product structure
       const transformedData = wishlistData.map(item => ({
         _id: item.productId._id,
         name: item.productId.name,
         description: item.productId.description,
         price: item.productId.price,
         image: item.productId.image,
         category: item.productId.category,
         rating: item.productId.averageRating || item.productId.rating, // Use averageRating if available
         reviewCount: item.productId.reviewCount,
         reason: 'Added to your wishlist',
         addedAt: item.addedAt,
         wishlistItemId: item._id // Store the wishlist item ID for removal
       }));
      
      console.log('Transformed wishlist data:', transformedData);
      return transformedData;
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      // Return fallback sample products if wishlist fails
      return [
        {
          _id: 'fallback-1',
          name: 'Sample Coffee',
          description: 'This is a sample product to show while we fix the database connection.',
          price: 150,
          image: '/images/coffee/Americano.jpeg',
          category: 'Coffee',
          rating: 4.5,
          reason: 'Sample product - database connection issue',
          addedAt: new Date(),
          wishlistItemId: 'fallback-1'
        }
      ];
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    if (!token) {
      console.log('No token available for wishlist removal');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3001/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Remove from local state
        setRecommendations(prev => ({
          ...prev,
          wishlist: prev.wishlist.filter(item => item._id !== productId)
        }));
        
        // Show success message
        setSuccessMessage('Item removed from wishlist successfully!');
        setTimeout(() => setSuccessMessage(''), 3000); // Hide after 3 seconds
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      setError('Failed to remove item from wishlist');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Refresh wishlist manually
  const refreshWishlist = async () => {
    setRefreshing(true);
    const wishlistProducts = await fetchWishlist();
    setRecommendations(prev => ({
      ...prev,
      wishlist: wishlistProducts
    }));
    setRefreshing(false);
  };

  // Fetch real user recommendations from database
  useEffect(() => {
    const fetchRecommendations = async () => {
      console.log('Fetching recommendations, user:', user);
      
      if (!userId) {
        console.log('No user ID, setting loading to false');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch wishlist products
        console.log('Fetching wishlist...');
        const wishlistProducts = await fetchWishlist();
        console.log('Wishlist products fetched:', wishlistProducts);
        
        // Fetch other recommendations
        console.log('Fetching user recommendations...');
        const response = await fetch('http://localhost:3001/user-recommendations', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }

        const data = await response.json();
        console.log('User recommendations data:', data);
        
                 // Transform buyAgain and recommended data to include proper rating fields
         const transformRecommendationData = (items) => {
           return items.map(item => ({
             ...item,
             rating: item.averageRating || item.rating, // Use averageRating if available
             reviewCount: item.reviewCount || 0
           }));
         };

         // Combine wishlist with other recommendations
         const combinedData = {
           wishlist: wishlistProducts,
           buyAgain: transformRecommendationData(data.buyAgain || []),
           recommended: transformRecommendationData(data.recommended || [])
         };
        
        console.log('Combined recommendations data:', combinedData);
        setRecommendations(combinedData);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to load recommendations');
        // Fallback to empty arrays
        setRecommendations({
          wishlist: [],
          buyAgain: [],
          recommended: []
        });
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have a userId and haven't fetched yet
    if (userId && !loading) {
      fetchRecommendations();
    }
  }, [userId]); // Remove user and token from dependencies to prevent duplicate calls

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.querySelector('#product-suggestions');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const handleAddToCart = async (product) => {
    await addToCart({
      ...product,
      quantity: 1
    });
  };

  const handleViewAll = (type) => {
    navigate('/menu', { state: { filter: type } });
  };

  const getCurrentItems = () => {
    switch (activeTab) {
      case 'wishlist':
        return recommendations.wishlist;
      case 'buyagain':
        return recommendations.buyAgain;
      case 'recommended':
        return recommendations.recommended;
      default:
        return recommendations.wishlist;
    }
  };

  // Auto-refresh wishlist when switching to wishlist tab
  useEffect(() => {
    if (activeTab === 'wishlist' && userId) {
      refreshWishlist();
    }
  }, [activeTab, userId]);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'wishlist':
        return 'Your Wishlist';
      case 'buyagain':
        return 'Buy Again';
      case 'recommended':
        return 'Recommended for You';
      default:
        return 'Your Wishlist';
    }
  };

  const styles = {
    section: {
      backgroundColor: '#faf8f3',
      padding: '100px 24px',
      position: 'relative',
      overflow: 'hidden',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 2,
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
      transition: 'all 0.8s ease-out',
    },
    sectionTitle: {
      fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
      fontWeight: '800',
      color: '#5d4037',
      textAlign: 'center',
      marginBottom: '16px',
      lineHeight: '1.2',
      letterSpacing: '-0.02em',
    },
    sectionSubtitle: {
      fontSize: 'clamp(1rem, 1.5vw, 1.1rem)',
      color: '#6d4c41',
      textAlign: 'center',
      marginBottom: '60px',
      lineHeight: '1.6',
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    highlightText: {
      color: '#b8860b',
      fontWeight: '800',
    },
    tabContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '8px',
      marginBottom: '40px',
      flexWrap: 'wrap',
    },
    tab: {
      padding: '12px 24px',
      backgroundColor: '#fff',
      border: '2px solid #e2c48d',
      borderRadius: '25px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
      color: '#6d4c41',
      transition: 'all 0.3s ease',
      minWidth: '120px',
      textAlign: 'center',
    },
    activeTab: {
      backgroundColor: '#d2b262',
      borderColor: '#d2b262',
      color: '#fff',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(210, 178, 98, 0.3)',
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
      marginBottom: '40px',
       justifyContent: 'center',
    },
    productCard: {
      backgroundColor: '#fff',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
       borderWidth: '2px',
       borderStyle: 'solid',
       borderColor: 'rgba(212, 175, 55, 0.1)',
       width: '300px',
       maxWidth: '300px',
    },
    productCardHover: {
      transform: 'translateY(-8px)',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)',
      borderColor: '#d2b262',
    },
    productImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
      transition: 'transform 0.3s ease',
    },
    productImageHover: {
      transform: 'scale(1.05)',
    },
    productInfo: {
      padding: '24px',
    },
    productHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px',
    },
    productName: {
      fontSize: '1.2rem',
      fontWeight: '700',
      color: '#3b2f2f',
      margin: 0,
      lineHeight: '1.3',
    },
    productPrice: {
      fontSize: '1.1rem',
      fontWeight: '800',
      color: '#b8860b',
      margin: 0,
    },
    productCategory: {
      fontSize: '0.85rem',
      color: '#8d6e63',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '8px',
    },
    productDescription: {
      fontSize: '0.9rem',
      color: '#6d4c41',
      lineHeight: '1.5',
      marginBottom: '16px',
    },
    productMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    ratingText: {
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#b8860b',
    },
    specialInfo: {
      fontSize: '0.8rem',
      color: '#8d6e63',
      fontStyle: 'italic',
    },
    actionButtons: {
      display: 'flex',
      gap: '12px',
    },
    addToCartBtn: {
      flex: 1,
      backgroundColor: '#d2b262',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      padding: '12px 20px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    addToCartBtnHover: {
      backgroundColor: '#c19a4a',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(210, 178, 98, 0.4)',
    },
    viewAllBtn: {
      backgroundColor: 'transparent',
      color: '#d2b262',
      border: '2px solid #d2b262',
      borderRadius: '12px',
      padding: '12px 20px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    viewAllBtnHover: {
      backgroundColor: '#d2b262',
      color: '#fff',
      transform: 'translateY(-2px)',
    },
    decorativeElement: {
      position: 'absolute',
      top: '15%',
      left: '5%',
      width: '200px',
      height: '200px',
      background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 70%, transparent 100%)',
      borderRadius: '50%',
      zIndex: 1,
      animation: 'float 8s ease-in-out infinite',
    },
    decorativeElement2: {
      position: 'absolute',
      bottom: '20%',
      right: '8%',
      width: '180px',
      height: '180px',
      background: 'radial-gradient(circle, rgba(193, 154, 107, 0.08) 0%, rgba(193, 154, 107, 0.04) 70%, transparent 100%)',
      borderRadius: '50%',
      zIndex: 1,
      animation: 'float 6s ease-in-out infinite reverse',
    },
  };

  const animationStyles = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
    }
  `;

  return (
    <section id="product-suggestions" style={styles.section}>
      <style>{animationStyles}</style>
      
      {/* Decorative elements */}
      <div style={styles.decorativeElement}></div>
      <div style={styles.decorativeElement2}></div>
      
      <div style={styles.container}>
        <h2 style={styles.sectionTitle}>
          Discover <span style={styles.highlightText}>More</span>
        </h2>
        <p style={styles.sectionSubtitle}>
          Personalized recommendations and your favorite items, all in one place.
        </p>
        
        {/* Tab Navigation */}
        <div style={styles.tabContainer}>
          <button
            style={activeTab === 'wishlist' ? { ...styles.tab, ...styles.activeTab } : styles.tab}
            onClick={() => setActiveTab('wishlist')}
          >
            Wishlist
          </button>
          <button
            style={activeTab === 'buyagain' ? { ...styles.tab, ...styles.activeTab } : styles.tab}
            onClick={() => setActiveTab('buyagain')}
          >
            Buy Again
          </button>
          <button
            style={activeTab === 'recommended' ? { ...styles.tab, ...styles.activeTab } : styles.tab}
            onClick={() => setActiveTab('recommended')}
          >
            Recommended
          </button>
        </div>

         {/* Refresh Button for Wishlist */}
         {activeTab === 'wishlist' && (
           <div style={{ textAlign: 'center', marginBottom: '20px' }}>
             <button
               onClick={refreshWishlist}
               disabled={refreshing}
               style={{
                 ...styles.addToCartBtn,
                 backgroundColor: refreshing ? '#ccc' : '#b8860b',
                 padding: '8px 16px',
                 fontSize: '0.9rem',
                 cursor: refreshing ? 'not-allowed' : 'pointer'
               }}
             >
               {refreshing ? 'Refreshing...' : '🔄 Refresh Wishlist'}
             </button>
           </div>
         )}

         {/* Success Message */}
         {successMessage && (
           <div style={{ 
             textAlign: 'center', 
             marginBottom: '20px', 
             padding: '12px', 
             backgroundColor: '#4caf50', 
             color: 'white', 
             borderRadius: '8px',
             animation: 'fadeIn 0.3s ease-in'
           }}>
             {successMessage}
           </div>
         )}

        {/* Products Grid */}
        <div style={styles.productsGrid}>
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#6d4c41' }}>
              <p>Loading personalized recommendations...</p>
            </div>
          ) : error ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#d32f2f' }}>
              <p>{error}</p>
            </div>
          ) : getCurrentItems().length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#6d4c41' }}>
              <p>No {activeTab === 'wishlist' ? 'wishlist items' : activeTab === 'buyagain' ? 'recent orders' : 'recommendations'} available yet.</p>
              <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>
                {activeTab === 'wishlist' ? 'Start ordering to build your wishlist!' : 
                 activeTab === 'buyagain' ? 'Make your first order to see items here!' : 
                 'Complete your profile to get personalized recommendations!'}
              </p>
            </div>
          ) : (
            getCurrentItems().map((product) => (
                        <div
              key={product.id || product._id}
              style={styles.productCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.borderColor = '#d2b262';
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.1)';
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = 'scale(1)';
              }}
            >
              <img
                   src={product.image ? `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/images/${product.image}` : '/menu-images/default-avatar.svg'}
                alt={product.name}
                style={styles.productImage}
              />
              <div style={styles.productInfo}>
                <div style={styles.productHeader}>
                  <h3 style={styles.productName}>{product.name}</h3>
                  <span style={styles.productPrice}>₹{product.price}</span>
                </div>
                
                  {product.category && (
                <div style={styles.productCategory}>{product.category}</div>
                  )}
                  {product.description && (
                <p style={styles.productDescription}>{product.description}</p>
                  )}
                
                <div style={styles.productMeta}>
                  {product.lastOrdered && (
                    <span style={styles.specialInfo}>{product.lastOrdered}</span>
                  )}
                  {product.reason && (
                    <span style={styles.specialInfo}>{product.reason}</span>
                  )}
                  {product.badge && (
                    <span style={styles.specialInfo}>{product.badge}</span>
                  )}
                </div>
                
                <div style={styles.actionButtons}>
                  <button
                    style={styles.addToCartBtn}
                    onClick={async () => await handleAddToCart(product)}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#c19a4a';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(210, 178, 98, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#d2b262';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    Add to Cart
                  </button>
                     
                     
                </div>
              </div>
            </div>
            ))
          )}
        </div>


      </div>
    </section>
  );
};

export default ProductSuggestionsSection;
