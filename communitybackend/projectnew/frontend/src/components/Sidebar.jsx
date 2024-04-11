import React from 'react'

const Sidebar = () => {
    return (
        <div>

            <div class="offcanvas offcanvas-start show text-bg-dark" tabindex="-1" id="offcanvasDark" aria-labelledby="offcanvasDarkLabel">
                <div class="offcanvas-header">
                    <h5 class="offcanvas-title" id="offcanvasDarkLabel">Offcanvas</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvasDark" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                    <p>Place offcanvas content here.</p>
                </div>
            </div>

        </div>
    )
}

export default Sidebar