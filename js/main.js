/**
 * OAKHAVEN VANGUARD: THE SUNSTONE QUEST
 * Modern Clean JavaScript Engine (Enhanced Interactive UI & Animated Chests)
 */

document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // 1. LIVE GOLD & HUD SYSTEM (SILENT & PERSISTENT)
    // =========================================================================
    let playerGold = parseInt(localStorage.getItem('oakhaven_gold')) || 250;
    let playerFury = 65;

    const desktopGoldElem = document.getElementById('desktopGold');
    const mobileGoldElem = document.getElementById('mobileGold');
    const desktopFuryElem = document.getElementById('desktopFury');
    const armoryBalanceElem = document.getElementById('armoryBalance');

    function updateGoldUI() {
        if (desktopGoldElem) desktopGoldElem.innerText = `${playerGold} G`;
        if (mobileGoldElem) mobileGoldElem.innerText = `${playerGold} G`;
        if (desktopFuryElem) desktopFuryElem.innerText = `${playerFury}%`;
        if (armoryBalanceElem) armoryBalanceElem.innerText = playerGold;
        localStorage.setItem('oakhaven_gold', playerGold);
    }
    updateGoldUI();

    function addGold(amount) {
        playerGold += amount;
        updateGoldUI();
    }

    // =========================================================================
    // 2. TOAST NOTIFICATIONS & INTERACTIVE GLORIOUS CHESTS
    // =========================================================================
    const lootToastShelf = document.getElementById('lootToastShelf');

    function showToast(title, desc, type = 'gold') {
        if (!lootToastShelf) return;
        const toast = document.createElement('div');
        toast.className = 'loot-toast';

        let iconHtml = '<i class="ri-gift-fill" style="color: var(--gold);"></i>';
        if (type === 'victory') iconHtml = '<i class="ri-trophy-fill" style="color: var(--gold);"></i>';
        if (type === 'armory') iconHtml = '<i class="ri-shield-check-fill" style="color: var(--vanguard-cyan);"></i>';

        toast.innerHTML = `
            <div class="loot-toast-icon">${iconHtml}</div>
            <div class="loot-toast-content">
                <div class="loot-toast-title">${title}</div>
                <div class="loot-toast-desc">${desc}</div>
            </div>
        `;

        lootToastShelf.appendChild(toast);
        setTimeout(() => toast.remove(), 4200);
    }

    function setupChestOpening(chestWrap) {
        if (!chestWrap) return;
        const chest = chestWrap.querySelector('.sprite-chest');
        const hintPill = chestWrap.querySelector('.chest-hint-pill');
        let autoResetTimer = null;

        // Determine reward by context
        let reward = 50;
        let chestTitle = 'ANCIENT TREASURE CHEST';
        if (chestWrap.id === 'vaultChestWrap') {
            reward = 100;
            chestTitle = 'ROYAL VAULT CHEST';
        } else if (chestWrap.id === 'arenaVictoryChest') {
            reward = 75;
            chestTitle = 'ARENA VICTORY CHEST';
        }

        chestWrap.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!chest) return;

            // IF CHEST IS CURRENTLY OPENED -> RE-LOCK / RESET ON CLICK!
            if (chest.classList.contains('opened')) {
                if (autoResetTimer) clearTimeout(autoResetTimer);
                chest.classList.remove('opened');
                chest.classList.remove('opening');
                if (hintPill) {
                    hintPill.classList.remove('opened');
                    hintPill.innerText = `LOOT CHEST (+${reward}G)`;
                }
                showFloatingText(chestWrap, 'CHEST RE-LOCKED!', 'parry');
                return;
            }

            // IF CHEST IS CLOSED -> OPEN WITH GLORIOUS ANIMATIONS!
            if (!chest.classList.contains('opening')) {
                chest.classList.add('opening');
                if (hintPill) {
                    hintPill.innerText = 'OPENING...';
                }

                // 1. Radiant ascending light ray beam
                const lightRay = document.createElement('div');
                lightRay.className = 'chest-light-ray';
                chestWrap.appendChild(lightRay);
                setTimeout(() => lightRay.remove(), 1400);

                // 2. Bursting spinning gold coins fountain (5 coins)
                for (let i = 0; i < 5; i++) {
                    const coin = document.createElement('div');
                    coin.className = 'chest-burst-coin';
                    const spreadX = (i - 2) * 22;
                    coin.style.left = `calc(50% + ${spreadX}px)`;
                    coin.style.top = '10px';
                    coin.style.transition = 'all 0.8s cubic-bezier(0.15, 0.85, 0.25, 1)';
                    chestWrap.appendChild(coin);

                    setTimeout(() => {
                        const heightY = 60 + Math.random() * 35;
                        coin.style.transform = `translateY(-${heightY}px) scale(1.25)`;
                        coin.style.opacity = '0';
                    }, 25);

                    setTimeout(() => coin.remove(), 850);
                }

                // 3. Sparkling gems & stars
                const gemIcons = ['💎', '✨', '🪙', '⭐'];
                for (let i = 0; i < 4; i++) {
                    const gem = document.createElement('div');
                    gem.className = 'chest-burst-gem';
                    gem.innerText = gemIcons[i];
                    const angle = (i * 90 - 45) * (Math.PI / 180);
                    const dist = 55 + Math.random() * 25;
                    const tx = Math.cos(angle) * dist;
                    const ty = -Math.abs(Math.sin(angle) * dist) - 30;
                    gem.style.setProperty('--tx', `${tx}px`);
                    gem.style.setProperty('--ty', `${ty}px`);
                    gem.style.left = 'calc(50% - 8px)';
                    gem.style.top = '10px';
                    chestWrap.appendChild(gem);

                    setTimeout(() => gem.remove(), 1100);
                }

                // 4. Settle on Open State after step animation
                setTimeout(() => {
                    chest.classList.remove('opening');
                    chest.classList.add('opened');
                    if (hintPill) {
                        hintPill.classList.add('opened');
                        hintPill.innerText = `✨ +${reward}G CLAIMED! (TAP TO RESET)`;
                    }
                }, 400);

                // 5. Award Gold, floating text, and celebratory toast
                addGold(reward);
                showFloatingText(chestWrap, `+${reward} GOLD!`, 'heal');
                showToast(`👑 ${chestTitle} UNLOCKED!`, `You claimed +${reward} Royal Gold Coins & Sunstone Core Shard!`, 'gold');

                // If arena victory chest, trigger next opponent after looting
                if (chestWrap.id === 'arenaVictoryChest') {
                    setTimeout(() => {
                        chestWrap.style.display = 'none';
                        const keys = Object.keys(enemyTypes);
                        const nextKey = keys[Math.floor(Math.random() * keys.length)];
                        switchOpponent(nextKey);
                    }, 1400);
                } else {
                    // Auto-reset after 15 seconds if unclicked
                    autoResetTimer = setTimeout(() => {
                        if (chest.classList.contains('opened')) {
                            chest.classList.remove('opened');
                            if (hintPill) {
                                hintPill.classList.remove('opened');
                                hintPill.innerText = `LOOT CHEST (+${reward}G)`;
                            }
                        }
                    }, 15000);
                }
            }
        });
    }

    document.querySelectorAll('.sprite-chest-wrap').forEach(setupChestOpening);

    // Claim Daily Royal Tribute Button
    const claimTributeBtn = document.getElementById('claimTributeBtn');
    if (claimTributeBtn) {
        claimTributeBtn.addEventListener('click', () => {
            addGold(100);
            showFloatingText(claimTributeBtn, '+100 GOLD TRIBUTE!', 'crit');
            showToast('👑 DAILY TRIBUTE CLAIMED!', 'Blacksmith Brom granted you +100 Royal Vanguard Gold!', 'gold');
        });
    }

    // =========================================================================
    // 3. INTERACTIVE HERO DIORAMA (CLICK TO ATTACK / FLINCH / SUNBURST)
    // =========================================================================
    const heroKaelWrap = document.getElementById('heroKaelWrap');
    const heroKaelSprite = document.getElementById('heroKaelSprite');
    const heroOrcWrap = document.getElementById('heroOrcWrap');
    const heroOrcSprite = document.getElementById('heroOrcSprite');
    const sunstoneCore = document.querySelector('.sunstone-core');

    if (heroKaelWrap && heroKaelSprite) {
        heroKaelWrap.addEventListener('click', () => {
            heroKaelSprite.className = 'char-sprite kael-attack1';
            showFloatingText(heroKaelWrap, 'SLASH!', 'parry');
            setTimeout(() => {
                heroKaelSprite.className = 'char-sprite kael-idle';
            }, 500);
        });
    }

    if (heroOrcWrap && heroOrcSprite) {
        heroOrcWrap.addEventListener('click', () => {
            heroOrcSprite.className = 'char-sprite orc-hurt';
            showFloatingText(heroOrcWrap, 'GRRR!', 'crit');
            setTimeout(() => {
                heroOrcSprite.className = 'char-sprite orc-idle';
            }, 450);
        });
    }

    if (sunstoneCore) {
        sunstoneCore.addEventListener('click', () => {
            showFloatingText(sunstoneCore, '+10 DAWN FURY!', 'heal');
            playerFury = Math.min(100, playerFury + 10);
            updateGoldUI();
            sunstoneCore.style.transform = 'scale(1.3)';
            setTimeout(() => { sunstoneCore.style.transform = ''; }, 300);
        });
    }

    // =========================================================================
    // 4. HERO RPG TRANSMISSION & TYPEWRITER (SILENT)
    // =========================================================================
    const dialogues = [
        {
            speaker: "COMMANDER LYRA (OAKHAVEN WATCHTOWER)",
            text: "Captain Kael! Overlord Malakor's Bloodfang Horde has shattered our watchtowers and seized the Sacred Sunstone! Take up your Sunforged Greatsword and march east before the dawn is extinguished forever!"
        },
        {
            speaker: "CAPTAIN KAEL (ROYAL VANGUARD)",
            text: "The Sunstone's warmth shall not perish while a single knight of Oakhaven draws breath. Ready my Eagle-Eye bow and Alchemist's belt—I march for the Sunstone Sanctum!"
        },
        {
            speaker: "ELDER THORNE (ANCIENT WAYSTONE)",
            text: "Beware the Venomous Bogs and Grommash's Bastion ahead! Time your Shield Guard with precision to execute Perfect Parries and reflect their lethal strikes!"
        }
    ];

    let currentDialogueIdx = 0;
    let typeTimeout = null;
    const dialogueSpeakerElem = document.getElementById('dialogueSpeaker');
    const dialogueMsgElem = document.getElementById('dialogueMsg');
    const nextDialogueBtn = document.getElementById('nextDialogueBtn');
    const skipDialogueBtn = document.getElementById('skipDialogueBtn');

    function typeWriter(text) {
        if (!dialogueMsgElem) return;
        clearTimeout(typeTimeout);
        dialogueMsgElem.innerHTML = '';
        let charIndex = 0;

        function step() {
            if (charIndex < text.length) {
                dialogueMsgElem.innerHTML += text.charAt(charIndex);
                charIndex++;
                typeTimeout = setTimeout(step, 18);
            }
        }
        step();
    }

    function showDialogue(idx) {
        const item = dialogues[idx];
        if (!item) return;
        if (dialogueSpeakerElem) dialogueSpeakerElem.innerText = item.speaker;
        typeWriter(item.text);
    }
    showDialogue(0);

    if (nextDialogueBtn) {
        nextDialogueBtn.addEventListener('click', () => {
            currentDialogueIdx = (currentDialogueIdx + 1) % dialogues.length;
            showDialogue(currentDialogueIdx);
        });
    }

    if (skipDialogueBtn) {
        skipDialogueBtn.addEventListener('click', () => {
            clearTimeout(typeTimeout);
            const item = dialogues[currentDialogueIdx];
            if (dialogueMsgElem && item) dialogueMsgElem.innerText = item.text;
        });
    }

    // =========================================================================
    // 5. COMBAT ARENA ENGINE (STABLE & RESPONSIVE)
    // =========================================================================
    const arenaState = {
        playerHp: 100,
        playerMaxHp: 100,
        playerFury: 60,
        playerMaxFury: 100,
        comboStep: 1,
        isGuarding: false,

        enemyType: 'grunt',
        enemyHp: 120,
        enemyMaxHp: 120,
        enemyAtk: 15,
        isEnemyAttacking: false,

        score: 1850,
        comboStreak: 1
    };

    const enemyTypes = {
        grunt: { name: 'ORC GRUNT (SCOUT)', maxHp: 120, atk: 15, gold: 20, score: 120, isTitan: false },
        berserker: { name: 'ORC BERSERKER (CRIMSON)', maxHp: 220, atk: 25, gold: 45, score: 350, isTitan: false },
        vanguard: { name: 'ORC SHIELDBEARER', maxHp: 340, atk: 30, gold: 60, score: 500, isTitan: false },
        titan: { name: 'COLOSSAL GIANT TITAN', maxHp: 650, atk: 45, gold: 150, score: 1500, isTitan: true }
    };

    const playerSprite = document.getElementById('arenaPlayerSprite');
    const enemySprite = document.getElementById('arenaEnemySprite');
    const playerHpFill = document.getElementById('playerHpFill');
    const playerHpText = document.getElementById('playerHpText');
    const furyFill = document.getElementById('playerFuryFill');
    const furyText = document.getElementById('playerFuryText');
    const enemyHpFill = document.getElementById('enemyHpFill');
    const enemyHpText = document.getElementById('enemyHpText');
    const enemyNameLabel = document.getElementById('enemyNameLabel');
    const arenaScoreNum = document.getElementById('arenaScoreNum');
    const arenaComboPill = document.getElementById('arenaComboPill');
    const arenaStage = document.getElementById('arenaStage');
    const arenaShockwave = document.getElementById('arenaShockwave');
    const arenaLog = document.getElementById('arenaLog');

    function logArena(text) {
        if (arenaLog) arenaLog.innerHTML = text;
    }

    function showFloatingText(targetEl, text, type) {
        if (!arenaStage || !targetEl) return;
        const floatEl = document.createElement('div');
        floatEl.className = `floating-dmg-txt ${type || ''}`;
        floatEl.innerText = text;

        const rect = targetEl.getBoundingClientRect();
        const stageRect = arenaStage.getBoundingClientRect();
        const leftPos = Math.max(10, Math.min(arenaStage.clientWidth - 100, rect.left - stageRect.left + 15));
        const topPos = Math.max(10, rect.top - stageRect.top);

        floatEl.style.left = `${leftPos}px`;
        floatEl.style.top = `${topPos}px`;

        arenaStage.appendChild(floatEl);
        setTimeout(() => floatEl.remove(), 800);
    }

    function updateArenaStats() {
        if (playerHpFill) {
            const pct = Math.max(0, Math.min(100, (arenaState.playerHp / arenaState.playerMaxHp) * 100));
            playerHpFill.style.width = `${pct}%`;
            playerHpText.innerText = `${arenaState.playerHp}/${arenaState.playerMaxHp} HP`;
        }
        if (furyFill) {
            const pct = Math.max(0, Math.min(100, (arenaState.playerFury / arenaState.playerMaxFury) * 100));
            furyFill.style.width = `${pct}%`;
            furyText.innerText = `${arenaState.playerFury}% FURY`;
        }
        if (enemyHpFill) {
            const pct = Math.max(0, Math.min(100, (arenaState.enemyHp / arenaState.enemyMaxHp) * 100));
            enemyHpFill.style.width = `${pct}%`;
            enemyHpText.innerText = `${Math.max(0, arenaState.enemyHp)}/${arenaState.enemyMaxHp} HP`;
        }
        if (arenaScoreNum) arenaScoreNum.innerText = arenaState.score.toLocaleString();
        if (arenaComboPill) arenaComboPill.innerText = `${arenaState.comboStreak}x COMBO`;
    }

    function setKaelAnimation(cls, duration = 500) {
        if (!playerSprite) return;
        playerSprite.className = `char-sprite ${cls}`;
        setTimeout(() => {
            if (arenaState.playerHp > 0) {
                playerSprite.className = 'char-sprite kael-idle';
            }
        }, duration);
    }

    function setOrcAnimation(cls, duration = 500) {
        if (!enemySprite) return;
        const isTitan = arenaState.enemyType === 'titan';
        enemySprite.className = `char-sprite ${cls} ${isTitan ? 'titan-size' : ''}`;
        setTimeout(() => {
            if (arenaState.enemyHp > 0) {
                enemySprite.className = `char-sprite orc-idle ${isTitan ? 'titan-size' : ''}`;
            }
        }, duration);
    }

    function switchOpponent(typeKey) {
        const info = enemyTypes[typeKey];
        if (!info) return;
        arenaState.enemyType = typeKey;
        arenaState.enemyMaxHp = info.maxHp;
        arenaState.enemyHp = info.maxHp;
        arenaState.enemyAtk = info.atk;

        if (enemyNameLabel) enemyNameLabel.innerText = info.name;
        if (enemySprite) {
            enemySprite.className = `char-sprite orc-idle ${info.isTitan ? 'titan-size' : ''}`;
        }
        updateArenaStats();
        logArena(`Encountered <strong>${info.name}</strong>!`);
    }

    document.querySelectorAll('.opp-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.opp-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            switchOpponent(btn.getAttribute('data-opp'));
        });
    });

    // Enemy Auto Attack Cycle
    setInterval(() => {
        if (arenaState.enemyHp <= 0 || arenaState.playerHp <= 0 || arenaState.isEnemyAttacking) return;
        if (Math.random() < 0.4) {
            arenaState.isEnemyAttacking = true;
            setOrcAnimation('orc-attack', 600);

            setTimeout(() => {
                if (arenaState.enemyHp <= 0) {
                    arenaState.isEnemyAttacking = false;
                    return;
                }

                if (arenaState.isGuarding) {
                    arenaState.playerFury = Math.min(arenaState.playerMaxFury, arenaState.playerFury + 25);
                    arenaState.enemyHp -= 40;
                    showFloatingText(playerSprite, 'PERFECT PARRY! 0 DMG', 'parry');
                    showFloatingText(enemySprite, '-40 REFLECT', 'crit');
                    setOrcAnimation('orc-hurt', 400);
                    logArena(`★ <strong>PERFECT PARRY!</strong> Blocked attack & reflected 40 DMG!`);
                    updateArenaStats();
                } else {
                    const dmg = arenaState.enemyAtk;
                    arenaState.playerHp = Math.max(0, arenaState.playerHp - dmg);
                    setKaelAnimation('kael-hurt', 400);
                    showFloatingText(playerSprite, `-${dmg} HP`, '');
                    logArena(`Captain Kael took <strong>-${dmg} DMG</strong>!`);
                    updateArenaStats();

                    if (arenaState.playerHp <= 0) {
                        setKaelAnimation('kael-death', 1000);
                        logArena(`Captain Kael has fallen! Press [F] Potion to revive!`);
                    }
                }
                arenaState.isEnemyAttacking = false;
            }, 350);
        }
    }, 2800);

    function applyEnemyDamage(dmg, isCrit = false) {
        if (arenaState.enemyHp <= 0) return;
        arenaState.enemyHp -= dmg;
        arenaState.score += Math.floor(dmg * 2.5 * arenaState.comboStreak);
        arenaState.comboStreak = Math.min(8, arenaState.comboStreak + 1);

        setOrcAnimation('orc-hurt', 400);
        showFloatingText(enemySprite, `-${dmg}`, isCrit ? 'crit' : '');
        updateArenaStats();

        if (arenaState.enemyHp <= 0) {
            setOrcAnimation('orc-death', 800);
            const typeInfo = enemyTypes[arenaState.enemyType];
            const goldWon = typeInfo ? typeInfo.gold : 35;
            const scoreBonus = typeInfo ? typeInfo.score : 250;

            arenaState.score += scoreBonus;
            logArena(`★ Slain <strong>${typeInfo.name}</strong>! +${scoreBonus} Score!`);
            updateArenaStats();

            // Spawn Arena Victory Chest Drop!
            const victoryChest = document.getElementById('arenaVictoryChest');
            if (victoryChest) {
                victoryChest.style.display = 'inline-flex';
                victoryChest.classList.remove('chest-drop-anim');
                void victoryChest.offsetWidth; // force CSS reflow
                victoryChest.classList.add('chest-drop-anim');

                const chestInner = victoryChest.querySelector('.sprite-chest');
                const hintInner = victoryChest.querySelector('.chest-hint-pill');
                if (chestInner) {
                    chestInner.classList.remove('opened', 'opening');
                }
                if (hintInner) {
                    hintInner.classList.remove('opened');
                    hintInner.innerText = `LOOT BOUNTY (+${goldWon}G)`;
                }

                logArena(`👑 <strong>VICTORY CHEST DROPPED!</strong> Click it on the field to claim +${goldWon} Gold!`);
                showToast('🏆 VICTORY SPOILS!', `Click the glowing Victory Chest on the field to claim +${goldWon} Gold!`, 'victory');

                // Fallback auto-spawn if user doesn't click chest in 7 seconds
                setTimeout(() => {
                    if (victoryChest.style.display !== 'none') {
                        victoryChest.style.display = 'none';
                        addGold(goldWon);
                        const keys = Object.keys(enemyTypes);
                        const nextKey = keys[Math.floor(Math.random() * keys.length)];
                        switchOpponent(nextKey);
                    }
                }, 7000);
            } else {
                addGold(goldWon);
                setTimeout(() => {
                    const keys = Object.keys(enemyTypes);
                    const nextKey = keys[Math.floor(Math.random() * keys.length)];
                    switchOpponent(nextKey);
                }, 1400);
            }
        }
    }

    // Actions
    function actComboSlash() {
        if (arenaState.playerHp <= 0) return;
        const step = arenaState.comboStep;
        let anim = 'kael-attack1';
        let dmg = 40;

        if (step === 2) { anim = 'kael-attack2'; dmg = 55; }
        else if (step === 3) { anim = 'kael-attack3'; dmg = 85; }

        setKaelAnimation(anim, 500);
        arenaState.playerFury = Math.min(arenaState.playerMaxFury, arenaState.playerFury + 8);
        arenaState.comboStep = (step % 3) + 1;

        setTimeout(() => {
            applyEnemyDamage(dmg, step === 3);
            logArena(`Combo Strike #${step} dealt <strong>${dmg} DMG</strong>!`);
        }, 180);
    }

    function actHeavyCleave() {
        if (arenaState.playerHp <= 0) return;
        setKaelAnimation('kael-attack3', 700);
        setTimeout(() => {
            applyEnemyDamage(95, true);
            logArena(`Heavy Greatsword Cleave dealt <strong>95 DMG</strong>!`);
        }, 250);
    }

    function actLongbow() {
        if (arenaState.playerHp <= 0) return;
        if (arenaState.playerFury < 15) {
            logArena(`Not enough Fury! Need at least 15% Fury.`);
            return;
        }
        arenaState.playerFury -= 15;
        updateArenaStats();

        const arrow = document.createElement('div');
        arrow.className = 'arena-arrow-fx';
        const startX = 60;
        const targetX = Math.max(160, arenaStage.clientWidth - 85);
        arrow.style.left = `${startX}px`;
        arrow.style.bottom = `65px`;
        arenaStage.appendChild(arrow);

        let x = startX;
        const interval = setInterval(() => {
            x += 24;
            arrow.style.left = `${x}px`;
            if (x >= targetX) {
                clearInterval(interval);
                arrow.remove();
                applyEnemyDamage(65, true);
                logArena(`Eagle-Eye Longbow pierced foe for <strong>65 DMG</strong>!`);
            }
        }, 16);
    }

    function actGuard() {
        if (arenaState.playerHp <= 0) return;
        arenaState.isGuarding = true;
        setKaelAnimation('kael-idle', 800);
        showFloatingText(playerSprite, 'SHIELD RAISED!', 'parry');
        logArena(`Shield Raised! Time right as enemy strikes for Perfect Parry.`);
        setTimeout(() => { arenaState.isGuarding = false; }, 850);
    }

    function actUltimate() {
        if (arenaState.playerHp <= 0) return;
        if (arenaState.playerFury < 50) {
            logArena(`Ultimate requires 50% Fury Power.`);
            return;
        }
        arenaState.playerFury -= 50;
        arenaState.playerHp = Math.min(arenaState.playerMaxHp, arenaState.playerHp + 35);
        updateArenaStats();

        setKaelAnimation('kael-attack3', 900);
        if (arenaShockwave) {
            arenaShockwave.classList.add('active');
            setTimeout(() => arenaShockwave.classList.remove('active'), 700);
        }

        showFloatingText(playerSprite, '+35 HEAL', 'heal');
        showFloatingText(enemySprite, 'SUNBREAKER! -240', 'crit');
        applyEnemyDamage(240, true);
        logArena(`★ <strong>SUNBREAKER ULTIMATE!</strong> 240 AoE DMG & +35 HP Restore!`);
    }

    function actPotion() {
        arenaState.playerHp = Math.min(arenaState.playerMaxHp, arenaState.playerHp + 65);
        arenaState.playerFury = Math.min(arenaState.playerMaxFury, arenaState.playerFury + 25);
        showFloatingText(playerSprite, '+65 HP & +25 FURY', 'heal');
        updateArenaStats();
        logArena(`Drank an Alchemist's Potion (+65 HP, +25 Fury)!`);
    }

    const actBtnSlash = document.getElementById('actBtnSlash');
    const actBtnCleave = document.getElementById('actBtnCleave');
    const actBtnBow = document.getElementById('actBtnBow');
    const actBtnGuard = document.getElementById('actBtnGuard');
    const actBtnUlt = document.getElementById('actBtnUlt');
    const actBtnPotion = document.getElementById('actBtnPotion');

    if (actBtnSlash) actBtnSlash.addEventListener('click', actComboSlash);
    if (actBtnCleave) actBtnCleave.addEventListener('click', actHeavyCleave);
    if (actBtnBow) actBtnBow.addEventListener('click', actLongbow);
    if (actBtnGuard) actBtnGuard.addEventListener('click', actGuard);
    if (actBtnUlt) actBtnUlt.addEventListener('click', actUltimate);
    if (actBtnPotion) actBtnPotion.addEventListener('click', actPotion);

    window.addEventListener('keydown', (e) => {
        if (['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) return;
        const k = e.key.toLowerCase();
        if (k === 'j' || k === 'z') { e.preventDefault(); actComboSlash(); }
        else if (k === 'k' || k === 'x') { e.preventDefault(); actHeavyCleave(); }
        else if (k === 'l' || k === 'c') { e.preventDefault(); actLongbow(); }
        else if (k === 's' || k === 'arrowdown') { e.preventDefault(); actGuard(); }
        else if (k === 'q' || k === 'r') { e.preventDefault(); actUltimate(); }
        else if (k === 'f' || k === 'h') { e.preventDefault(); actPotion(); }
    });

    // =========================================================================
    // 6. GAME MODES TABS
    // =========================================================================
    const modeNavBtns = document.querySelectorAll('.mode-nav-btn');
    const modePanels = document.querySelectorAll('.mode-panel');

    modeNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            modeNavBtns.forEach(b => b.classList.remove('active'));
            modePanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const p = document.getElementById(target);
            if (p) p.classList.add('active');
        });
    });

    // =========================================================================
    // 7. CHRONICLES OF OAKHAVEN (THE 8 CHAPTERS)
    // =========================================================================
    const chaptersData = [
        {
            num: "CH. I",
            name: "Whispering Woods",
            zone: "Zone I: Oakhaven Outpost",
            speaker: "COMMANDER LYRA (WATCHTOWER BEACON)",
            quote: "\"Captain Kael! Overlord Malakor's Bloodfang Horde has stolen the Sacred Sunstone! Drink Healing Potions with [F] whenever wounded, guard with [S], or press [M] anytime to mute story popups.\"",
            danger: "★☆☆☆☆",
            hazard: "Watchtower Barricades",
            boss: "Orc Grunt Scouts",
            drops: "Common Potions & Coins"
        },
        {
            num: "CH. II",
            name: "Whispering Canopy",
            zone: "Zone II: The Sunken Ruins",
            speaker: "ELDER THORNE (ANCIENT WAYSTONE)",
            quote: "\"The Orcs flooded the valley with Venomous Bog! If you fall into poison or lava, your Vanguard armor will launch you upward so you can escape! Collect Crimson, Emerald, and Golden Potions to survive!\"",
            danger: "★★☆☆☆",
            hazard: "Venomous Bog & Spikes",
            boss: "Bog Ambushers",
            drops: "Emerald Vitality Elixir"
        },
        {
            num: "CH. III",
            name: "Emerald Waterfall",
            zone: "Zone III: Waterfall Crossing",
            speaker: "SCOUT MIRA (WATERFALL LOOKOUT)",
            quote: "\"Orc Archers and Berserkers guard the high suspension bridges! Use Double Jump [Space] and fire your Longbow [L], or leap high and press [S + J] for a Sky Plunge Slam!\"",
            danger: "★★★☆☆",
            hazard: "Aerial Suspension Falls",
            boss: "Orc Archer Ledges",
            drops: "Sunstone Brews"
        },
        {
            num: "CH. IV",
            name: "Sunken Poison Marsh",
            zone: "Zone IV: Grommash's Bastion Border",
            speaker: "WARLORD GROMMASH (MID-BOSS ARENA)",
            quote: "\"Grommash roars: 'You dare cross my marsh, little knight?! My cleaver will crush your bones!' Time your Shield Guard [S] right as he strikes to trigger a Perfect Parry!\"",
            danger: "★★★★☆",
            hazard: "Corrosive Acid Pits",
            boss: "WARLORD GROMMASH (MID-BOSS)",
            drops: "Colossal Bloodfang Chest"
        },
        {
            num: "CH. V",
            name: "Grommash's Bastion",
            zone: "Zone V: The Crimson Highlands",
            speaker: "VANGUARD BLACKSMITH BROM (FIELD ARMORY)",
            quote: "\"Beyond Grommash's gate lie the Crimson Highlands. Open the Royal Vanguard Armory to spend Gold Coins on stronger Greatswords, Bows, Armor, Boots, and Potions!\"",
            danger: "★★★☆☆",
            hazard: "Fortress Ramparts",
            boss: "Orc Vanguard Shieldbearers",
            drops: "Highland Armory Cache"
        },
        {
            num: "CH. VI",
            name: "Crimson Highlands",
            zone: "Zone VI: Obsidian Fortress Approach",
            speaker: "HIGH PRIESTESS ELARA (CRYSTAL SHRINE)",
            quote: "\"Malakor's dark magic fuels the Obsidian Fortress ahead. Fill your Fury bar and unleash your Sunbreaker Ultimate [Q] to cleave through shielded Vanguard Orcs and heal your wounds!\"",
            danger: "★★★★☆",
            hazard: "Obsidian Fire Geysers",
            boss: "Shadow Executioners",
            drops: "Cobalt Fury Draught"
        },
        {
            num: "CH. VII",
            name: "Obsidian Magma Bridge",
            zone: "Zone VII: Bridge of Ash & Fire",
            speaker: "CAPTAIN KAEL (INNER RESOLVE)",
            quote: "\"The molten chasm of the Obsidian Fortress burns below, and elite Shadow Executioners block the bridge. One final push east leads straight to the Sunstone Sanctum!\"",
            danger: "★★★★★",
            hazard: "Molten Lava Abyss",
            boss: "Elite Executioner Squad",
            drops: "Sacred Checkpoint Altar"
        },
        {
            num: "CH. VIII",
            name: "Sunstone Sanctum",
            zone: "Zone VIII: The High Altar",
            speaker: "OVERLORD MALAKOR, CONSUMER OF SUNS (FINAL BOSS)",
            quote: "\"Malakor laughs: 'Foolish mortal! The Sunstone's power is already mine!' Defeat Overlord Malakor and touch the Sacred Sunstone Altar to restore light to Oakhaven!\"",
            danger: "★★★★★ (MAX)",
            hazard: "Corrupted Sunstone Rays",
            boss: "OVERLORD MALAKOR (FINAL BOSS)",
            drops: "THE SACRED SUNSTONE"
        }
    ];

    const chaptersMenu = document.getElementById('chaptersMenu');
    const chapterDetailPane = document.getElementById('chapterDetailPane');

    function renderChapters() {
        if (!chaptersMenu) return;
        chaptersMenu.innerHTML = '';

        chaptersData.forEach((ch, idx) => {
            const btn = document.createElement('button');
            btn.className = `chapter-select-btn ${idx === 0 ? 'active' : ''}`;
            btn.innerHTML = `
                <span class="ch-badge">${ch.num}</span>
                <span class="ch-name">${ch.name}</span>
            `;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.chapter-select-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectChapter(idx);
            });
            chaptersMenu.appendChild(btn);
        });
    }

    function selectChapter(idx) {
        const c = chaptersData[idx];
        if (!chapterDetailPane || !c) return;

        chapterDetailPane.innerHTML = `
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
                    <span class="badge-tag badge-blue">${c.zone}</span>
                    <span style="font-family: var(--font-heading); font-size: 0.55rem; color: var(--crimson);">DANGER: ${c.danger}</span>
                </div>
                <h3 style="font-size: 1.15rem; color: #fff; margin-bottom: 0.5rem;">${c.name}</h3>

                <div class="zone-lore-callout">
                    <span class="zone-quote-speaker"><i class="ri-user-voice-fill"></i> ${c.speaker}</span>
                    <p class="zone-quote-text">${c.quote}</p>
                </div>
            </div>

            <div class="zone-specs-row">
                <div class="zone-spec-col">
                    <span class="zone-spec-label"><i class="ri-alert-fill"></i> HAZARD</span>
                    <span class="zone-spec-val">${c.hazard}</span>
                </div>
                <div class="zone-spec-col">
                    <span class="zone-spec-label"><i class="ri-sword-fill"></i> ENCOUNTER</span>
                    <span class="zone-spec-val">${c.boss}</span>
                </div>
                <div class="zone-spec-col">
                    <span class="zone-spec-label"><i class="ri-gift-fill"></i> DROPS</span>
                    <span class="zone-spec-val">${c.drops}</span>
                </div>
            </div>
        `;
    }

    renderChapters();
    selectChapter(0);

    // =========================================================================
    // 8. THE ROYAL VANGUARD ARMORY (UPGRADE SHOP)
    // =========================================================================
    const gearList = [
        {
            id: 'sword',
            name: 'Sunforged Greatsword',
            iconClass: 'ri-sword-fill',
            rank: 1,
            maxRank: 6,
            cost: 50,
            desc: '+12 Melee & Sky Plunge Damage per Rank.'
        },
        {
            id: 'bow',
            name: 'Eagle-Eye Longbow',
            iconClass: 'ri-crosshair-2-fill',
            rank: 1,
            maxRank: 6,
            cost: 65,
            desc: '+10 Arrow DMG (Unlocks Twin-Shot at Rank 3, Triple Volley at Rank 5).'
        },
        {
            id: 'plate',
            name: 'Royal Vanguard Plate',
            iconClass: 'ri-shield-fill',
            rank: 1,
            maxRank: 6,
            cost: 80,
            desc: '+35 Max HP & Instant Full Heal per Rank.'
        },
        {
            id: 'greaves',
            name: 'Windstrider Greaves',
            iconClass: 'ri-run-fill',
            rank: 1,
            maxRank: 6,
            cost: 55,
            desc: '+10% Speed (Triple Jump at Rank 2, Quad Jump at Rank 4).'
        },
        {
            id: 'conduit',
            name: 'Sunstone Fury Conduit',
            iconClass: 'ri-sun-fill',
            rank: 1,
            maxRank: 6,
            cost: 70,
            desc: '+25% Faster Fury Gain & +35 Max Power per Rank.'
        },
        {
            id: 'belt',
            name: 'Alchemist Potion Pack',
            iconClass: 'ri-flask-fill',
            rank: 1,
            maxRank: 6,
            cost: 45,
            desc: 'Refills +2 Potions, heals +65 HP, expands belt slots.'
        }
    ];

    const armoryGridElem = document.getElementById('armoryGrid');

    function renderArmory() {
        if (!armoryGridElem) return;
        armoryGridElem.innerHTML = '';

        gearList.forEach(item => {
            const isMax = item.rank >= item.maxRank;
            const stars = '★'.repeat(item.rank) + '☆'.repeat(item.maxRank - item.rank);

            const tile = document.createElement('div');
            tile.className = 'gear-tile';
            tile.innerHTML = `
                <div>
                    <div class="gear-tile-head">
                        <div class="gear-tile-icon"><i class="${item.iconClass}"></i></div>
                        <div>
                            <h4 style="font-size: 0.72rem; color: #fff; margin-bottom: 2px;">${item.name}</h4>
                            <span class="gear-stars-row">${stars} <span style="font-size: 0.58rem; color: var(--text-muted);">(Rank ${item.rank}/${item.maxRank})</span></span>
                        </div>
                    </div>
                    <p class="gear-desc-txt">${item.desc}</p>
                </div>
                <div class="gear-bottom-row">
                    <span style="font-family: var(--font-heading); font-size: 0.6rem; color: var(--gold); display: flex; align-items: center; gap: 4px;">
                        ${isMax ? 'MAX RANK' : `<span class="sprite-coin"></span> ${item.cost} Gold`}
                    </span>
                    <button class="btn-modern btn-sm btn-primary" ${isMax || playerGold < item.cost ? 'disabled' : ''}>
                        ${isMax ? 'MAXED' : 'UPGRADE'}
                    </button>
                </div>
            `;

            const btn = tile.querySelector('button');
            if (btn && !isMax) {
                btn.addEventListener('click', () => {
                    if (playerGold >= item.cost) {
                        playerGold -= item.cost;
                        item.rank++;
                        item.cost = Math.floor(item.cost * 1.6);
                        updateGoldUI();
                        renderArmory();
                        showFloatingText(tile, `RANK ${item.rank} UNLOCKED!`, 'heal');
                    }
                });
            }

            armoryGridElem.appendChild(tile);
        });
    }
    renderArmory();

    // =========================================================================
    // 9. BESTIARY FILTERING
    // =========================================================================
    const filterTabBtns = document.querySelectorAll('.filter-tab-btn');
    const monsterEntries = document.querySelectorAll('.monster-entry');

    filterTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const f = btn.getAttribute('data-filter');
            monsterEntries.forEach(entry => {
                if (f === 'all' || entry.getAttribute('data-cat') === f) {
                    entry.style.display = 'flex';
                } else {
                    entry.style.display = 'none';
                }
            });
        });
    });

    // =========================================================================
    // 10. BATTLE REPORT SCOREBOARD EVALUATOR
    // =========================================================================
    const sDist = document.getElementById('sDist');
    const sOrcs = document.getElementById('sOrcs');
    const sGiants = document.getElementById('sGiants');
    const sCombo = document.getElementById('sCombo');

    const lblDist = document.getElementById('lblDist');
    const lblOrcs = document.getElementById('lblOrcs');
    const lblGiants = document.getElementById('lblGiants');
    const lblCombo = document.getElementById('lblCombo');

    const calcRankSeal = document.getElementById('calcRankSeal');
    const calcRankTitle = document.getElementById('calcRankTitle');
    const calcTotalScore = document.getElementById('calcTotalScore');

    function evalScore() {
        if (!sDist || !sOrcs || !sGiants || !sCombo) return;
        const dist = parseInt(sDist.value) || 0;
        const orcs = parseInt(sOrcs.value) || 0;
        const giants = parseInt(sGiants.value) || 0;
        const combo = parseInt(sCombo.value) || 1;

        if (lblDist) lblDist.innerText = `${dist}m`;
        if (lblOrcs) lblOrcs.innerText = `${orcs}`;
        if (lblGiants) lblGiants.innerText = `${giants}`;
        if (lblCombo) lblCombo.innerText = `${combo}x`;

        const total = (dist * 12) + (orcs * 120 * combo) + (giants * 500 * combo) + 350;
        if (calcTotalScore) calcTotalScore.innerText = total.toLocaleString();

        let grade = 'D';
        let title = 'OAKHAVEN RECRUIT';
        let isLegend = false;

        if (total >= 50000) {
            grade = 'S+';
            title = 'IMMORTAL SUNSTONE LEGEND';
            isLegend = true;
        } else if (total >= 25000) {
            grade = 'S';
            title = 'GRAND HIGH MARSHAL';
        } else if (total >= 12000) {
            grade = 'A';
            title = 'ROYAL VANGUARD CHAMPION';
        } else if (total >= 5000) {
            grade = 'B';
            title = 'ROYAL IRON KNIGHT';
        } else if (total >= 2000) {
            grade = 'C';
            title = 'VALIANT OUTPOST GUARD';
        }

        if (calcRankSeal) {
            calcRankSeal.innerText = grade;
            calcRankSeal.classList.toggle('rank-s-plus', isLegend);
        }
        if (calcRankTitle) calcRankTitle.innerText = title;
    }

    [sDist, sOrcs, sGiants, sCombo].forEach(s => {
        if (s) s.addEventListener('input', evalScore);
    });
    evalScore();

    // =========================================================================
    // 11. DOWNLOAD & LIGHTBOX MODALS
    // =========================================================================
    const dlModal = document.getElementById('dlModal');
    const dlModalClose = document.getElementById('dlModalClose');
    const dlModalProceed = document.getElementById('dlModalProceed');
    const dlModalMsg = document.getElementById('dlModalMsg');

    const downloadLinks = {
        windows: 'https://drive.usercontent.google.com/download?id=1ZWdbt9dq9f8avk8V14sEDqKPOri27Ry7&export=download&authuser=0',
        // windows: 'V1.2/Oakhaven Vanguard The Sunstone Quest V1.2 Beta.exe',
        // windows_drive: 'https://drive.usercontent.google.com/download?id=1ZWdbt9dq9f8avk8V14sEDqKPOri27Ry7&export=download&authuser=0',
        // linux: 'V1.2/linux/Oakhaven Vanguard The Sunstone Quest.x86_64',
        // v1: 'V1.0/Oakhaven Vanguard The Sunstone Quest.exe'
    };
    let activeTarget = '';

    document.querySelectorAll('.btn-dl-action').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = btn.getAttribute('data-target') || 'windows';
            activeTarget = downloadLinks[target] || downloadLinks.windows;

            if (dlModalMsg) {
                dlModalMsg.innerHTML = `<strong>* ESTABLISHING VANGUARD PROTOCOL FOR [${target.toUpperCase()}] *</strong><br><br>Readying Godot 4.x executable package from the Royal Vanguard Vault. Confirm download transmission?`;
            }
            if (dlModalProceed) {
                dlModalProceed.innerText = 'BEGIN DOWNLOAD';
                dlModalProceed.disabled = false;
            }
            if (dlModal) dlModal.classList.add('active');
        });
    });

    if (dlModalClose) {
        dlModalClose.addEventListener('click', () => {
            if (dlModal) dlModal.classList.remove('active');
        });
    }

    if (dlModalProceed) {
        dlModalProceed.addEventListener('click', () => {
            dlModalProceed.innerText = 'TRANSMITTING...';
            dlModalProceed.disabled = true;

            setTimeout(() => {
                if (dlModal) dlModal.classList.remove('active');
                if (activeTarget) window.open(activeTarget, '_blank');
            }, 800);
        });
    }

    // Lightbox
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    document.querySelectorAll('.gallery-tile-item').forEach(tile => {
        tile.addEventListener('click', () => {
            const img = tile.querySelector('img');
            if (img && lightboxImg && lightboxModal) {
                lightboxImg.src = img.src;
                lightboxModal.classList.add('active');
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            if (lightboxModal) lightboxModal.classList.remove('active');
        });
    }
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) lightboxModal.classList.remove('active');
        });
    }

    // =========================================================================
    // 12. ACTIVE NAVIGATION & SMOOTH MOBILE SCROLLING
    // =========================================================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-item-link, .dock-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const isMobile = window.innerWidth <= 900;
                    const offset = isMobile ? 65 : 24;
                    const topPos = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({
                        top: topPos,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    window.addEventListener('scroll', () => {
        let currentSection = '';
        const scrollPos = window.pageYOffset + 120;

        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                currentSection = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
});
