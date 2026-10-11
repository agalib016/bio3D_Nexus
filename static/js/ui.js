/**
 * BIO3D NEXUS - User Interface, Audio Synthesis & Interaction Controller
 * Handles mega body parts dropdown, full-body camera zoom transitions,
 * coronal cutaway view, Web Audio synthesis, and clinical metadata HUDs.
 */

class UIController {
    constructor() {
        this.currentOrganData = null;
        this.audioEnabled = false;
        this.audioCtx = null;
        this.heartbeatTimer = null;
        this.ekgAnimationId = null;

        // Quiz State
        this.quizQuestions = [];
        this.currentQuizIdx = 0;
        this.quizScore = 0;

        this.initDOMElements();
        this.bindEvents();
        this.initEKGMonitor();
        this.loadOrganData('full_body'); // Start on Full Body overview!
    }

    initDOMElements() {
        // Nav elements
        this.organTabs = document.querySelectorAll('.organ-chip');
        this.organDropdownWrapper = document.getElementById('organDropdownWrapper');
        this.organDropdownBtn = document.getElementById('organDropdownBtn');
        this.organDropdownMenu = document.getElementById('organDropdownMenu');
        this.organDropdownFilter = document.getElementById('organDropdownFilter');
        this.organMenuItems = document.querySelectorAll('.organ-menu-item');
        this.navSelectedOrganIcon = document.getElementById('navSelectedOrganIcon');
        this.navSelectedOrganName = document.getElementById('navSelectedOrganName');

        this.renderModeBtn = document.getElementById('renderModeMenuBtn');
        this.renderModeMenu = document.getElementById('renderModeMenu');
        this.renderModeWrapper = this.renderModeBtn?.parentElement;
        this.explodeToggleBtn = document.getElementById('explodeToggleBtn');
        this.coronalCutBtn = document.getElementById('coronalCutBtn');
        this.vitalMotionBtn = document.getElementById('vitalMotionBtn');
        this.audioSynthBtn = document.getElementById('audioSynthBtn');
        this.audioIcon = document.getElementById('audioIcon');
        this.searchTriggerBtn = document.getElementById('searchTriggerBtn');
        this.clinicalDrawerBtn = document.getElementById('clinicalDrawerBtn');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');

        // Sidebar Elements
        this.sidebarInspector = document.getElementById('sidebarInspector');
        this.sidebarTabs = document.querySelectorAll('.sb-tab');
        this.sidebarContents = document.querySelectorAll('.sb-tab-content');
        this.segmentsList = document.getElementById('segmentsList');
        this.segmentsBadgeCount = document.getElementById('segmentsBadgeCount');
        this.pathologyList = document.getElementById('pathologyList');
        this.clinicalFactsList = document.getElementById('clinicalFactsList');
        this.specCardTitle = document.getElementById('specCardTitle');
        this.specCardDesc = document.getElementById('specCardDesc');
        this.specDataTable = document.getElementById('specDataTable');

        // Active Segment Card
        this.activePartCard = document.getElementById('activePartCard');
        this.partDot = document.getElementById('partDot');
        this.partNameDisplay = document.getElementById('partNameDisplay');
        this.partSummaryDisplay = document.getElementById('partSummaryDisplay');

        // Floating Overlays
        this.hudOrganIcon = document.getElementById('hudOrganIcon');
        this.hudOrganName = document.getElementById('hudOrganName');
        this.hudOrganSystem = document.getElementById('hudOrganSystem');
        this.hudOrganLatin = document.getElementById('hudOrganLatin');
        this.hudRateVal = document.getElementById('hudRateVal');
        this.hudWeightVal = document.getElementById('hudWeightVal');
        this.hudFlowVal = document.getElementById('hudFlowVal');
        this.hudSegmentCount = document.getElementById('hudSegmentCount');
        this.explodeSlider = document.getElementById('explodeSlider');
        this.resetExplodeBtn = document.getElementById('resetExplodeBtn');
        this.zoomOutBodyBtn = document.getElementById('zoomOutBodyBtn');

        // Dock Buttons
        this.dockResetCam = document.getElementById('dockResetCam');
        this.dockAutoRotate = document.getElementById('dockAutoRotate');
        this.dockPinsToggle = document.getElementById('dockPinsToggle');
        this.dockCutawayView = document.getElementById('dockCutawayView');
        this.dockSnapshot = document.getElementById('dockSnapshot');

        // Modals
        this.searchModal = document.getElementById('searchModalBackdrop');
        this.searchInput = document.getElementById('anatomySearchInput');
        this.searchResultsList = document.getElementById('searchResultsList');
        this.searchClearBtn = document.getElementById('searchClearBtn');

        this.quizModal = document.getElementById('quizModalBackdrop');
        this.quizModalBtn = document.getElementById('quizModalBtn');
        this.quizCloseBtn = document.getElementById('quizCloseBtn');

        // Hotspot Popup
        this.hotspotPopup = document.getElementById('hotspotPopup');
        this.popupSegmentName = document.getElementById('popupSegmentName');
        this.popupSegmentDesc = document.getElementById('popupSegmentDesc');
        this.popupSegmentMetrics = document.getElementById('popupSegmentMetrics');
        this.popupCloseBtn = document.getElementById('popupCloseBtn');
        this.popupIsolateBtn = document.getElementById('popupIsolateBtn');

        this.toastContainer = document.getElementById('toastContainer');
    }

    bindEvents() {
        // Mega Dropdown Toggle
        if (this.organDropdownBtn) {
            this.organDropdownBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.organDropdownWrapper.classList.toggle('open');
                if (this.organDropdownWrapper.classList.contains('open')) {
                    setTimeout(() => this.organDropdownFilter?.focus(), 50);
                }
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (this.organDropdownWrapper && !this.organDropdownWrapper.contains(e.target)) {
                this.organDropdownWrapper.classList.remove('open');
            }
            if (this.renderModeWrapper && !this.renderModeWrapper.contains(e.target)) {
                this.renderModeWrapper.classList.remove('open');
            }
        });

        // Dropdown Search Filter
        if (this.organDropdownFilter) {
            this.organDropdownFilter.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();
                this.organMenuItems.forEach(item => {
                    const text = item.textContent.toLowerCase();
                    item.style.display = text.includes(query) ? 'flex' : 'none';
                });
            });
        }

        // Dropdown Item Click
        this.organMenuItems.forEach(item => {
            item.addEventListener('click', () => {
                const organId = item.dataset.organ;
                this.switchOrgan(organId);
                this.organDropdownWrapper.classList.remove('open');
            });
        });

        // Quick Pill Tabs Click
        this.organTabs.forEach(chip => {
            chip.addEventListener('click', () => {
                const organId = chip.dataset.organ;
                this.switchOrgan(organId);
            });
        });

        // Zoom Out to Full Body Button
        if (this.zoomOutBodyBtn) {
            this.zoomOutBodyBtn.addEventListener('click', () => {
                this.switchOrgan('full_body');
                this.showToast('Returned to Full Human Body Overview');
            });
        }

        // Coronal Cut / Internal Dissection Toggle (like heart_2.jpg!)
        const handleCutawayToggle = () => {
            if (window.anatomyViewer) {
                const active = window.anatomyViewer.toggleCutaway();
                if (this.coronalCutBtn) this.coronalCutBtn.classList.toggle('active', active);
                if (this.dockCutawayView) this.dockCutawayView.classList.toggle('active', active);

                const label = document.getElementById('cutawayLabel');
                if (label) label.textContent = active ? 'Cutaway ON' : 'Dissection Cut';

                this.showToast(active 
                    ? 'Internal Chamber & Valve Coronal Cutaway Activated (Demo Photo 2 View)' 
                    : 'Restored Full Anatomical Specimen Exterior');
            }
        };

        if (this.coronalCutBtn) this.coronalCutBtn.addEventListener('click', handleCutawayToggle);
        if (this.dockCutawayView) this.dockCutawayView.addEventListener('click', handleCutawayToggle);

        // Render Mode Menu Toggle
        if (this.renderModeBtn) {
            this.renderModeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.renderModeWrapper.classList.toggle('open');
            });
        }

        // Render Mode Selection
        const modeItems = document.querySelectorAll('.dropdown-item');
        modeItems.forEach(item => {
            item.addEventListener('click', () => {
                const mode = item.dataset.mode;
                modeItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                const label = document.getElementById('currentModeLabel');
                if (label) label.textContent = item.textContent.trim();

                if (window.anatomyViewer) {
                    window.anatomyViewer.setRenderMode(mode);
                }
                this.showToast(`Rendering shader: ${item.textContent.trim()}`);
            });
        });

        // Explode View Trigger & Slider
        if (this.explodeToggleBtn) {
            this.explodeToggleBtn.addEventListener('click', () => {
                if (window.anatomyViewer) window.anatomyViewer.toggleExplode();
            });
        }

        if (this.explodeSlider) {
            this.explodeSlider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value) / 100;
                if (window.anatomyViewer) window.anatomyViewer.setExplode(val);
            });
        }

        if (this.resetExplodeBtn) {
            this.resetExplodeBtn.addEventListener('click', () => {
                if (window.anatomyViewer) window.anatomyViewer.setExplode(0.0);
            });
        }

        // Vital Motion Toggle
        if (this.vitalMotionBtn) {
            this.vitalMotionBtn.addEventListener('click', () => {
                if (window.anatomyViewer) {
                    window.anatomyViewer.vitalMotionEnabled = !window.anatomyViewer.vitalMotionEnabled;
                    this.vitalMotionBtn.classList.toggle('active', window.anatomyViewer.vitalMotionEnabled);
                    this.showToast(window.anatomyViewer.vitalMotionEnabled ? 'Vital Motion Simulation Active' : 'Vital Motion Paused');
                }
            });
        }

        // Audio Synth
        if (this.audioSynthBtn) {
            this.audioSynthBtn.addEventListener('click', () => {
                this.toggleAudio();
            });
        }

        // Action Dock
        if (this.dockResetCam) {
            this.dockResetCam.addEventListener('click', () => {
                if (window.anatomyViewer) window.anatomyViewer.resetCamera();
            });
        }

        if (this.dockAutoRotate) {
            this.dockAutoRotate.addEventListener('click', () => {
                if (window.anatomyViewer) {
                    const active = window.anatomyViewer.toggleAutoRotate();
                    this.dockAutoRotate.classList.toggle('active', active);
                    const label = document.getElementById('rotateStateLabel');
                    if (label) label.textContent = active ? 'Orbiting' : 'Auto Orbit';
                }
            });
        }

        if (this.dockPinsToggle) {
            this.dockPinsToggle.addEventListener('click', () => {
                if (window.anatomyViewer) {
                    const active = window.anatomyViewer.toggleLabels();
                    this.dockPinsToggle.classList.toggle('active', active);
                    const label = document.getElementById('pinsStateLabel');
                    if (label) label.textContent = active ? 'Labels ON' : 'Labels OFF';
                }
            });
        }

        if (this.dockSnapshot) {
            this.dockSnapshot.addEventListener('click', () => {
                if (window.anatomyViewer) {
                    window.anatomyViewer.captureSnapshot();
                    this.showToast('High-Resolution Anatomical Snapshot Exported!');
                }
            });
        }

        // Sidebar Tabs
        this.sidebarTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.tab;
                this.sidebarTabs.forEach(t => t.classList.remove('active'));
                this.sidebarContents.forEach(c => c.classList.remove('active'));
                tab.classList.add('active');

                const content = document.getElementById(`content${target.charAt(0).toUpperCase() + target.slice(1)}`);
                if (content) content.classList.add('active');
            });
        });

        // Sidebar Drawer for Mobile
        if (this.clinicalDrawerBtn) {
            this.clinicalDrawerBtn.addEventListener('click', () => {
                this.sidebarInspector.classList.toggle('open');
            });
        }

        // Fullscreen Toggle
        if (this.fullscreenBtn) {
            this.fullscreenBtn.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                    this.fullscreenBtn.classList.add('active');
                } else {
                    document.exitFullscreen().catch(() => {});
                    this.fullscreenBtn.classList.remove('active');
                }
            });
        }

        // Show All & Reset Segment buttons
        document.getElementById('showAllSegmentsBtn')?.addEventListener('click', () => {
            if (window.anatomyViewer) window.anatomyViewer.showAllSegments();
            document.querySelectorAll('.segment-item-card').forEach(c => c.classList.remove('hidden-part'));
            this.showToast('All anatomical components restored');
        });

        document.getElementById('isolateNoneBtn')?.addEventListener('click', () => {
            if (window.anatomyViewer) {
                window.anatomyViewer.showAllSegments();
                window.anatomyViewer.setExplode(0.0);
            }
            document.querySelectorAll('.segment-item-card').forEach(c => {
                c.classList.remove('hidden-part');
                c.classList.remove('highlighted');
            });
            this.hideHotspotPopup();
        });

        // Search Shortcuts & Modal
        if (this.searchTriggerBtn) {
            this.searchTriggerBtn.addEventListener('click', () => this.openSearchModal());
        }

        window.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                this.openSearchModal();
            }
            if (e.key === 'Escape') {
                this.closeSearchModal();
                this.closeQuizModal();
                this.hideHotspotPopup();
            }
        });

        this.searchModal?.addEventListener('click', (e) => {
            if (e.target === this.searchModal) this.closeSearchModal();
        });

        this.searchClearBtn?.addEventListener('click', () => {
            if (this.searchInput) {
                this.searchInput.value = '';
                this.performSearch('');
            }
        });

        this.searchInput?.addEventListener('input', (e) => {
            this.performSearch(e.target.value);
        });

        // Quiz Modal
        this.quizModalBtn?.addEventListener('click', () => this.openQuizModal());
        this.quizCloseBtn?.addEventListener('click', () => this.closeQuizModal());
        this.quizModal?.addEventListener('click', (e) => {
            if (e.target === this.quizModal) this.closeQuizModal();
        });

        // Hotspot Popup Close & Zoom
        this.popupCloseBtn?.addEventListener('click', () => this.hideHotspotPopup());
        this.popupIsolateBtn?.addEventListener('click', () => {
            if (!this.currentSelectedSegmentId) return;

            // If in full body, jump straight to the organ!
            if (this.currentOrganData?.id === 'full_body') {
                const seg = this.currentOrganData.segments?.find(s => s.id === this.currentSelectedSegmentId);
                if (seg?.targetOrgan) {
                    this.switchOrgan(seg.targetOrgan);
                    this.hideHotspotPopup();
                    return;
                }
            }

            if (window.anatomyViewer) {
                window.anatomyViewer.isolateSegment(this.currentSelectedSegmentId);
                this.showToast(`Isolated structure: ${this.currentSelectedSegmentId}`);
                this.hideHotspotPopup();
            }
        });

        // Window Custom Events from 3D Engine
        window.addEventListener('segmentSelected', (e) => this.onSegmentSelected(e.detail));
        window.addEventListener('segmentHovered', (e) => this.onSegmentHovered(e.detail.segmentId));
        window.addEventListener('segmentUnhovered', (e) => this.onSegmentUnhovered(e.detail.segmentId));
        window.addEventListener('organLoaded', (e) => this.loadOrganData(e.detail.organId));
    }

    /* -------------------------------------------------------------
       ORGAN DATA FETCH & SELECTION
       ------------------------------------------------------------- */
    switchOrgan(organId) {
        // Sync Dropdown menu selection
        this.organMenuItems.forEach(item => {
            item.classList.toggle('active', item.dataset.organ === organId);
            if (item.dataset.organ === organId) {
                const icon = item.querySelector('.menu-icon')?.textContent || '🧍';
                const title = item.querySelector('.item-title')?.textContent || 'Body Part';
                if (this.navSelectedOrganIcon) this.navSelectedOrganIcon.textContent = icon;
                if (this.navSelectedOrganName) this.navSelectedOrganName.textContent = title;
            }
        });

        // Sync Quick Pill Tabs
        this.organTabs.forEach(chip => {
            chip.classList.toggle('active', chip.dataset.organ === organId);
        });

        if (window.anatomyViewer) {
            window.anatomyViewer.loadOrgan(organId);
        }

        this.hideHotspotPopup();
        this.restartAudioPulse(organId);
    }

    async loadOrganData(organId) {
        try {
            const res = await fetch(`/api/organ/${organId}`);
            const json = await res.json();
            if (json.status === 'success') {
                this.currentOrganData = json.data;
                this.renderOrganHUD(this.currentOrganData);
                this.renderSegmentsList(this.currentOrganData.segments || []);
                this.renderClinicalData(this.currentOrganData);
                this.renderSpecData(this.currentOrganData);
            }
        } catch (err) {
            console.error('Failed to load organ data:', err);
        }
    }

    renderOrganHUD(data) {
        if (this.hudOrganIcon) this.hudOrganIcon.textContent = data.icon || '🫀';
        if (this.hudOrganName) this.hudOrganName.textContent = data.name;
        if (this.hudOrganSystem) this.hudOrganSystem.textContent = data.system;
        if (this.hudOrganLatin) this.hudOrganLatin.textContent = data.latin;

        if (this.hudRateVal) this.hudRateVal.textContent = data.rate || data.capacity || data.emptying_time || data.functions_count || 'Active';
        if (this.hudWeightVal) this.hudWeightVal.textContent = data.weight || data.diameter || data.height || '~300g';
        if (this.hudFlowVal) this.hudFlowVal.textContent = data.output || data.surface_area || data.filtration || data.blood_supply?.slice(0, 24) || 'Dynamic';
        if (this.hudSegmentCount) this.hudSegmentCount.textContent = `${data.segments?.length || 0} Parts`;

        if (this.segmentsBadgeCount) this.segmentsBadgeCount.textContent = data.segments?.length || 0;
    }

    renderSegmentsList(segments) {
        if (!this.segmentsList) return;
        this.segmentsList.innerHTML = '';

        segments.forEach(seg => {
            const card = document.createElement('div');
            card.className = 'segment-item-card';
            card.dataset.segmentId = seg.id;

            card.innerHTML = `
                <div class="seg-meta-left">
                    <span class="seg-color-chip" style="background-color: ${seg.color}; box-shadow: 0 0 8px ${seg.color}66;"></span>
                    <div class="seg-info">
                        <span class="seg-name">${seg.name}</span>
                        <span class="seg-sub">${(seg.function || '').slice(0, 48)}...</span>
                    </div>
                </div>
                <div class="seg-actions-right">
                    <button class="seg-action-icon-btn btn-isolate" title="Zoom & Inspect Structure">
                        <i class="fa-solid fa-magnifying-glass-plus"></i>
                    </button>
                    <button class="seg-action-icon-btn btn-visibility active" title="Toggle Visibility">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                </div>
            `;

            card.addEventListener('mouseenter', () => {
                if (window.anatomyViewer) window.anatomyViewer.hoveredSegment = seg.id;
                this.onSegmentHovered(seg.id);
            });

            card.addEventListener('mouseleave', () => {
                this.onSegmentUnhovered(seg.id);
            });

            card.addEventListener('click', (e) => {
                if (e.target.closest('.seg-action-icon-btn')) return;
                if (window.anatomyViewer) window.anatomyViewer.selectSegment(seg.id);
            });

            // Visibility toggle
            const visBtn = card.querySelector('.btn-visibility');
            visBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isCurrentlyActive = visBtn.classList.toggle('active');
                visBtn.querySelector('i').className = isCurrentlyActive ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
                card.classList.toggle('hidden-part', !isCurrentlyActive);

                if (window.anatomyViewer) {
                    window.anatomyViewer.setSegmentVisibility(seg.id, isCurrentlyActive);
                }
            });

            // Zoom / Isolate button
            const isoBtn = card.querySelector('.btn-isolate');
            isoBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.currentOrganData?.id === 'full_body' && seg.targetOrgan) {
                    this.switchOrgan(seg.targetOrgan);
                } else if (window.anatomyViewer) {
                    window.anatomyViewer.isolateSegment(seg.id);
                    document.querySelectorAll('.segment-item-card').forEach(c => {
                        c.classList.toggle('hidden-part', c.dataset.segmentId !== seg.id);
                    });
                    this.showToast(`Inspecting ${seg.name}`);
                }
            });

            this.segmentsList.appendChild(card);
        });
    }

    renderClinicalData(data) {
        if (!this.pathologyList || !this.clinicalFactsList) return;
        this.pathologyList.innerHTML = '';
        this.clinicalFactsList.innerHTML = '';

        (data.segments || []).forEach(seg => {
            if (seg.pathology) {
                const entry = document.createElement('div');
                entry.className = 'pathology-entry';
                entry.innerHTML = `
                    <div class="pathology-part">${seg.name}</div>
                    <div class="pathology-desc">${seg.pathology}</div>
                `;
                this.pathologyList.appendChild(entry);
            }
        });

        (data.clinical_facts || []).forEach(fact => {
            const li = document.createElement('li');
            li.textContent = fact;
            this.clinicalFactsList.appendChild(li);
        });
    }

    renderSpecData(data) {
        if (this.specCardTitle) this.specCardTitle.textContent = data.name;
        if (this.specCardDesc) this.specCardDesc.textContent = data.overview;

        if (this.specDataTable) {
            this.specDataTable.innerHTML = `
                <div class="spec-row">
                    <span class="spec-key">Anatomical System</span>
                    <span class="spec-val">${data.system}</span>
                </div>
                <div class="spec-row">
                    <span class="spec-key">Latin Terminology</span>
                    <span class="spec-val">${data.latin}</span>
                </div>
                <div class="spec-row">
                    <span class="spec-key">Mass / Dimension</span>
                    <span class="spec-val">${data.weight || data.diameter || data.height || data.length || 'N/A'}</span>
                </div>
                <div class="spec-row">
                    <span class="spec-key">Blood Supply</span>
                    <span class="spec-val">${data.blood_supply || 'Systemic Arterial'}</span>
                </div>
            `;
        }
    }

    /* -------------------------------------------------------------
       SEGMENT SELECTION & HOVER
       ------------------------------------------------------------- */
    onSegmentSelected(detail) {
        const segId = detail.segmentId;
        this.currentSelectedSegmentId = segId;

        if (!this.currentOrganData) return;
        const seg = this.currentOrganData.segments?.find(s => s.id === segId);
        if (!seg) return;

        document.querySelectorAll('.segment-item-card').forEach(c => {
            c.classList.toggle('highlighted', c.dataset.segmentId === segId);
        });

        if (this.partDot) this.partDot.style.backgroundColor = seg.color;
        if (this.partNameDisplay) this.partNameDisplay.textContent = seg.name;
        if (this.partSummaryDisplay) {
            this.partSummaryDisplay.innerHTML = `
                <strong>Physiology:</strong> ${seg.function}<br>
                <strong>Clinical Notes:</strong> ${seg.pathology || 'No acute pathology.'}
            `;
        }

        this.showHotspotPopup(seg, detail.clientX, detail.clientY);
    }

    onSegmentHovered(segId) {
        const card = document.querySelector(`.segment-item-card[data-segment-id="${segId}"]`);
        if (card) card.classList.add('highlighted');
    }

    onSegmentUnhovered(segId) {
        if (this.currentSelectedSegmentId !== segId) {
            const card = document.querySelector(`.segment-item-card[data-segment-id="${segId}"]`);
            if (card) card.classList.remove('highlighted');
        }
    }

    showHotspotPopup(seg, clientX, clientY) {
        if (!this.hotspotPopup) return;

        if (this.popupSegmentName) this.popupSegmentName.textContent = seg.name;
        if (this.popupSegmentDesc) this.popupSegmentDesc.textContent = seg.function;

        if (this.popupSegmentMetrics) {
            let metricHtml = '';
            if (seg.pathology) {
                metricHtml += `
                    <div class="popup-metric-row">
                        <span>Pathologies:</span>
                        <span>${seg.pathology}</span>
                    </div>
                `;
            }
            if (seg.blood_type || seg.pressure) {
                metricHtml += `
                    <div class="popup-metric-row">
                        <span>Hemodynamics:</span>
                        <span>${seg.blood_type || seg.pressure}</span>
                    </div>
                `;
            }
            this.popupSegmentMetrics.innerHTML = metricHtml || `
                <div class="popup-metric-row">
                    <span>Segmentation Status:</span>
                    <span>Anatomically Isolated</span>
                </div>
            `;
        }

        const vpRect = document.getElementById('viewport3D').getBoundingClientRect();
        let posX = clientX ? (clientX - vpRect.left) : (vpRect.width / 2);
        let posY = clientY ? (clientY - vpRect.top) : (vpRect.height / 2);

        posX = Math.max(160, Math.min(vpRect.width - 160, posX));
        posY = Math.max(140, Math.min(vpRect.height - 40, posY));

        this.hotspotPopup.style.left = `${posX}px`;
        this.hotspotPopup.style.top = `${posY}px`;
        this.hotspotPopup.style.display = 'block';
    }

    hideHotspotPopup() {
        if (this.hotspotPopup) this.hotspotPopup.style.display = 'none';
    }

    /* -------------------------------------------------------------
       PHYSIOLOGICAL AUDIO SYNTHESIS
       ------------------------------------------------------------- */
    initAudioContext() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    toggleAudio() {
        this.audioEnabled = !this.audioEnabled;
        if (this.audioEnabled) {
            this.initAudioContext();
            this.audioIcon.className = 'fa-solid fa-volume-high text-accent';
            this.audioSynthBtn.classList.add('active');
            this.showToast('Physiological Audio Simulation Enabled');
            this.restartAudioPulse(this.currentOrganData?.id || 'heart');
        } else {
            this.audioIcon.className = 'fa-solid fa-volume-xmark';
            this.audioSynthBtn.classList.remove('active');
            this.stopAudioPulse();
            this.showToast('Audio Simulation Muted');
        }
    }

    restartAudioPulse(organId) {
        this.stopAudioPulse();
        if (!this.audioEnabled) return;

        if (organId === 'heart' || organId === 'full_body') {
            this.playLubDub();
            this.heartbeatTimer = setInterval(() => {
                this.playLubDub();
            }, 800);
        } else if (organId === 'lungs') {
            this.playBreathSound();
            this.heartbeatTimer = setInterval(() => {
                this.playBreathSound();
            }, 4000);
        } else if (organId === 'brain') {
            this.playNeuralHum();
            this.heartbeatTimer = setInterval(() => {
                this.playNeuralHum();
            }, 2500);
        }
    }

    stopAudioPulse() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }

    playLubDub() {
        if (!this.audioCtx || this.audioCtx.state !== 'running') return;
        const now = this.audioCtx.currentTime;
        this.createTone(75, 42, 0.12, now, 0.45);
        this.createTone(95, 55, 0.10, now + 0.18, 0.38);
    }

    createTone(startFreq, endFreq, duration, startTime, volume) {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(startFreq, startTime);
        osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);

        gain.gain.setValueAtTime(volume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    playBreathSound() {
        if (!this.audioCtx || this.audioCtx.state !== 'running') return;
        const bufferSize = this.audioCtx.sampleRate * 1.5;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const noise = this.audioCtx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 650;
        filter.Q.value = 2.0;

        const gain = this.audioCtx.createGain();
        const now = this.audioCtx.currentTime;
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.7);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioCtx.destination);

        noise.start(now);
    }

    playNeuralHum() {
        if (!this.audioCtx || this.audioCtx.state !== 'running') return;
        this.createTone(432, 216, 0.35, this.audioCtx.currentTime, 0.04);
    }

    /* -------------------------------------------------------------
       REAL-TIME EKG MONITOR OSCILLOSCOPE
       ------------------------------------------------------------- */
    initEKGMonitor() {
        const canvas = document.getElementById('ekgCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        let x = 0;
        let points = [];

        const renderEKG = () => {
            ctx.fillStyle = 'rgba(6, 9, 19, 0.08)';
            ctx.fillRect(0, 0, w, h);

            const cycleX = x % 120;
            let y = h / 2;

            if (cycleX > 20 && cycleX < 35) {
                y -= Math.sin((cycleX - 20) / 15 * Math.PI) * 4;
            } else if (cycleX >= 42 && cycleX <= 45) {
                y += 3;
            } else if (cycleX > 45 && cycleX < 55) {
                y -= 16;
            } else if (cycleX >= 55 && cycleX <= 58) {
                y += 6;
            } else if (cycleX > 70 && cycleX < 92) {
                y -= Math.sin((cycleX - 70) / 22 * Math.PI) * 6;
            }

            points.push({ x: x % w, y: y });
            if (points.length > w) points.shift();

            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 1.6;
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            for (let i = 0; i < points.length; i++) {
                if (i === 0) ctx.moveTo(points[i].x, points[i].y);
                else {
                    if (Math.abs(points[i].x - points[i - 1].x) < 5) ctx.lineTo(points[i].x, points[i].y);
                    else ctx.moveTo(points[i].x, points[i].y);
                }
            }
            ctx.stroke();

            ctx.fillStyle = '#060913';
            ctx.fillRect((x + 2) % w, 0, 10, h);

            x += 2;
            this.ekgAnimationId = requestAnimationFrame(renderEKG);
        };

        renderEKG();
    }

    /* -------------------------------------------------------------
       SEARCH ANATOMICAL STRUCTURES
       ------------------------------------------------------------- */
    openSearchModal() {
        if (!this.searchModal) return;
        this.searchModal.classList.add('open');
        setTimeout(() => {
            this.searchInput?.focus();
            if (this.searchInput?.value) this.performSearch(this.searchInput.value);
        }, 50);
    }

    closeSearchModal() {
        if (this.searchModal) this.searchModal.classList.remove('open');
    }

    async performSearch(query) {
        if (!this.searchResultsList) return;
        const q = query.trim().toLowerCase();

        if (!q) {
            this.searchResultsList.innerHTML = `<div class="search-hint">Type to locate any of 60+ segmented anatomical structures...</div>`;
            return;
        }

        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
            const data = await res.json();
            const results = data.results || [];

            if (results.length === 0) {
                this.searchResultsList.innerHTML = `<div class="search-hint">No anatomical structures matching "${query}".</div>`;
                return;
            }

            this.searchResultsList.innerHTML = '';
            results.forEach((item, idx) => {
                const el = document.createElement('div');
                el.className = `search-result-item ${idx === 0 ? 'selected' : ''}`;
                el.innerHTML = `
                    <span class="search-result-icon">${item.icon}</span>
                    <div class="search-result-info">
                        <span class="search-result-title">${item.title}</span>
                        <span class="search-result-sub">${item.subtitle}</span>
                    </div>
                    <i class="fa-solid fa-arrow-right text-accent" style="font-size: 0.8rem;"></i>
                `;

                el.addEventListener('click', () => {
                    this.closeSearchModal();
                    this.switchOrgan(item.organ_id);
                    if (item.segment_id) {
                        setTimeout(() => {
                            if (window.anatomyViewer) window.anatomyViewer.selectSegment(item.segment_id);
                        }, 350);
                    }
                });

                this.searchResultsList.appendChild(el);
            });
        } catch (err) {
            console.error('Search error:', err);
        }
    }

    /* -------------------------------------------------------------
       INTERACTIVE ANATOMICAL QUIZ
       ------------------------------------------------------------- */
    async openQuizModal() {
        if (!this.quizModal) return;
        this.quizModal.classList.add('open');
        this.currentQuizIdx = 0;
        this.quizScore = 0;

        try {
            const res = await fetch('/api/quiz');
            const data = await res.json();
            this.quizQuestions = data.questions || [];
            this.renderQuizQuestion();
        } catch (err) {
            console.error('Quiz fetch error:', err);
        }
    }

    closeQuizModal() {
        if (this.quizModal) this.quizModal.classList.remove('open');
    }

    renderQuizQuestion() {
        if (!this.quizQuestions.length) return;
        const q = this.quizQuestions[this.currentQuizIdx];

        const counter = document.getElementById('quizCounter');
        const qText = document.getElementById('quizQuestionText');
        const fill = document.getElementById('quizProgressFill');
        const optionsBox = document.getElementById('quizOptionsContainer');
        const feedbackBox = document.getElementById('quizFeedbackBox');
        const nextBtn = document.getElementById('quizNextBtn');
        const scoreDisplay = document.getElementById('quizScoreDisplay');

        if (counter) counter.textContent = `Question ${this.currentQuizIdx + 1} of ${this.quizQuestions.length}`;
        if (qText) qText.textContent = q.question;
        if (fill) fill.style.width = `${((this.currentQuizIdx + 1) / this.quizQuestions.length) * 100}%`;
        if (scoreDisplay) scoreDisplay.textContent = `Score: ${this.quizScore} / ${this.quizQuestions.length}`;

        if (feedbackBox) feedbackBox.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';

        if (optionsBox) {
            optionsBox.innerHTML = '';
            q.options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-opt-btn';
                btn.textContent = `${['A', 'B', 'C', 'D'][idx]}. ${opt}`;

                btn.addEventListener('click', () => {
                    this.handleQuizAnswer(idx, q);
                });

                optionsBox.appendChild(btn);
            });
        }
    }

    handleQuizAnswer(selectedIdx, question) {
        const optionsBox = document.getElementById('quizOptionsContainer');
        const buttons = optionsBox.querySelectorAll('.quiz-opt-btn');
        buttons.forEach(b => b.disabled = true);

        const feedbackBox = document.getElementById('quizFeedbackBox');
        const fbTitle = document.getElementById('feedbackTitle');
        const fbText = document.getElementById('feedbackText');
        const nextBtn = document.getElementById('quizNextBtn');
        const scoreDisplay = document.getElementById('quizScoreDisplay');

        const isCorrect = (selectedIdx === question.correct);
        if (isCorrect) {
            this.quizScore++;
            buttons[selectedIdx].classList.add('correct');
            if (fbTitle) {
                fbTitle.textContent = '✓ Correct Answer!';
                fbTitle.style.color = 'var(--accent-emerald)';
            }
        } else {
            buttons[selectedIdx].classList.add('wrong');
            buttons[question.correct].classList.add('correct');
            if (fbTitle) {
                fbTitle.textContent = '✗ Incorrect!';
                fbTitle.style.color = 'var(--accent-crimson)';
            }
        }

        if (fbText) fbText.textContent = question.explanation;
        if (feedbackBox) feedbackBox.style.display = 'block';

        if (scoreDisplay) scoreDisplay.textContent = `Score: ${this.quizScore} / ${this.quizQuestions.length}`;

        if (nextBtn) {
            nextBtn.style.display = 'inline-flex';
            nextBtn.onclick = () => {
                if (this.currentQuizIdx < this.quizQuestions.length - 1) {
                    this.currentQuizIdx++;
                    this.renderQuizQuestion();
                } else {
                    this.showToast(`Quiz completed! Final Score: ${this.quizScore}/${this.quizQuestions.length}`);
                    this.closeQuizModal();
                }
            };
        }
    }

    /* -------------------------------------------------------------
       TOAST ALERTS
       ------------------------------------------------------------- */
    showToast(message) {
        if (!this.toastContainer) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid fa-circle-check text-accent"></i> <span>${message}</span>`;

        this.toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2800);
    }
}

window.uiController = null;
window.addEventListener('DOMContentLoaded', () => {
    window.uiController = new UIController();
});
