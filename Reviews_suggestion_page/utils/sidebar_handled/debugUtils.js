// Debug utilities for Load More functionality
// This file helps identify the correct HTML structure and IDs

const DebugUtils = {
    /**
     * Analyze the DOM structure to help identify correct IDs
     * @param {string} sectionKey - Section key to analyze
     */
    analyzeDOMStructure(sectionKey) {
        console.group('🔍 DOM Structure Analysis for:', sectionKey);
        
        const sectionConfig = LoadMoreConfig.sections[sectionKey];
        if (!sectionConfig) {
            console.error('Section config not found for:', sectionKey);
            console.groupEnd();
            return;
        }

        // Find the section container
        const containers = document.querySelectorAll('.sidebar-section');
        console.log('Found sidebar sections:', containers.length);
        
        containers.forEach((container, index) => {
            console.group(`📦 Section ${index + 1}:`);
            console.log('Container:', container);
            
            // Find all elements with IDs
            const elementsWithIds = container.querySelectorAll('[id]');
            console.log('Elements with IDs:', Array.from(elementsWithIds).map(el => ({
                id: el.id,
                classes: el.className,
                tagName: el.tagName
            })));
            
            // Find tab content elements
            const tabContents = container.querySelectorAll('.sidebar-tab-content');
            console.log('Tab contents:', Array.from(tabContents).map(el => ({
                id: el.id,
                classes: el.className,
                active: el.classList.contains('active')
            })));
            
            // Find load more containers
            const loadMoreContainers = container.querySelectorAll('.load-more-container');
            console.log('Load more containers:', loadMoreContainers.length);
            loadMoreContainers.forEach((lmc, idx) => {
                console.log(`  Load more container ${idx + 1}:`, {
                    element: lmc,
                    parent: lmc.parentElement,
                    parentId: lmc.parentElement?.id,
                    parentClass: lmc.parentElement?.className
                });
            });
            
            // Find load more buttons
            const loadMoreButtons = container.querySelectorAll('.btn-load-more');
            console.log('Load more buttons:', loadMoreButtons.length);
            loadMoreButtons.forEach((btn, idx) => {
                console.log(`  Load more button ${idx + 1}:`, {
                    element: btn,
                    parent: btn.parentElement,
                    onclick: btn.onclick ? btn.onclick.toString().substring(0, 50) + '...' : 'none'
                });
            });
            
            console.groupEnd();
        });
        
        console.groupEnd();
    },

    /**
     * Find and test the load more insertion point
     * @param {string} sectionKey - Section key to test
     */
    testLoadMoreInsertion(sectionKey) {
        console.group('🎯 Testing Load More Insertion Points for:', sectionKey);
        
        const containers = document.querySelectorAll('.sidebar-section');
        
        containers.forEach((container, index) => {
            console.group(`Testing container ${index + 1}:`);
            
            // Try to find active content
            const activeContent = container.querySelector('.sidebar-tab-content.active');
            if (activeContent) {
                console.log('Active content found:', activeContent.id);
                
                // Test different insertion strategies
                const strategies = [
                    {
                        name: 'Direct .load-more-container',
                        element: activeContent.querySelector('.load-more-container')
                    },
                    {
                        name: 'Parent .load-more-container',
                        element: activeContent.parentElement?.querySelector('.load-more-container')
                    },
                    {
                        name: 'Direct .btn-load-more parent',
                        element: activeContent.querySelector('.btn-load-more')?.parentElement
                    },
                    {
                        name: 'Parent .btn-load-more parent',
                        element: activeContent.parentElement?.querySelector('.btn-load-more')?.parentElement
                    },
                    {
                        name: 'Active content itself',
                        element: activeContent
                    }
                ];
                
                strategies.forEach(strategy => {
                    console.log(`${strategy.name}:`, {
                        found: !!strategy.element,
                        element: strategy.element,
                        id: strategy.element?.id,
                        className: strategy.element?.className
                    });
                });
            } else {
                console.log('No active content found');
            }
            
            console.groupEnd();
        });
        
        console.groupEnd();
    },

    /**
     * Test ID generation patterns
     * @param {string} sectionKey - Section key to test
     */
    testIdPatterns(sectionKey) {
        console.group('🧪 Testing ID Patterns for:', sectionKey);
        
        const sectionConfig = LoadMoreConfig.sections[sectionKey];
        const testTabs = ['latest', 'oldest', 'pending', 'active', 'live', 'completed'];
        
        testTabs.forEach(tab => {
            const patterns = [
                `${sectionConfig.sectionId.replace('-', '')}-${tab}`, // toprated-latest
                `${sectionConfig.sectionId}-${tab}`, // top-rated-latest
                `${sectionConfig.sectionId.replace('-', '')}${tab}`, // topratedlatest
                `${sectionConfig.sectionId}-content-${tab}`, // top-rated-content-latest
                `${sectionConfig.sectionId.replace('-', '')}_${tab}`, // toprated_latest
                `${tab}`, // just tab name
                `${sectionConfig.sectionId}-${tab}-content` // top-rated-latest-content
            ];
            
            console.log(`Tab "${tab}" patterns:`, patterns.map(pattern => ({
                pattern,
                exists: !!document.getElementById(pattern)
            })));
        });
        
        console.groupEnd();
    },

    /**
     * Get actual HTML structure for debugging
     */
    getHTMLStructure() {
        console.group('📋 Current HTML Structure:');
        
        const sections = document.querySelectorAll('.sidebar-section');
        sections.forEach((section, index) => {
            console.log(`Section ${index + 1} HTML:`, section.outerHTML.substring(0, 200) + '...');
        });
        
        console.groupEnd();
    }
};

// Add to window for easy access in console
if (typeof window !== 'undefined') {
    window.DebugUtils = DebugUtils;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DebugUtils;
}
