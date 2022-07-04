<template>
    <div class="position-absolute top-0 bottom-0 start-0 end-0 d-flex align-items-center justify-content-center">
    
        <div v-if="isMobile == true" class="position-absolute bg-grid top-0 bottom-0 start-0 end-0 d-flex align-items-center justify-content-center">
            <div class="p-3">
                <div class="row g-3">
                    <div class="col-12 text-center"><img :src="require(`~/assets/icon.png`)" width="36px" class="rounded" /></div>
                    <div class="col-12 text-normal text-center h5">FG Factory</div>
                    <div class="col-12 text-primary text-center">Your device is not supported for the moment.</div>
                    <div class="col-12 text-normal text-center">To be informed when your device will be supported and new features will be ready, please join Discord server.</div>
                    <div class="col-12 d-flex justify-content-center">
                        <a href="https://discord.gg/3UkgeeT9CV" target="_blank" class="btn btn-primary">
                            <img :src="require(`~/assets/ui/discord.png`)" width="16px" height="16px" alt="Discord" />
                            <span class="ms-2">Discord</span>
                        </a>
                    </div>                
                </div>
            </div>
        </div>

        <div v-if="toastText" class="position-absolute container" style="bottom:50px; z-index:100;">
            <div class="d-flex justify-content-end">
                <div class="toast bg-primary show toast-body py-2 mb-2 text-end">
                    <span :class="{ 'text-dark':toastType == 'info', 'text-danger':toastType == 'error', 'text-success':toastType == 'success' }" v-html="toastText"></span>
                </div>
            </div>
        </div>
                
        <div v-if="popupWipe" class="position-absolute top-0 bottom-0 start-0 end-0 bg-overlay d-flex align-items-center justify-content-center" style="z-index:100;">
            <div class="card" style="width:380px; overflow-y:auto; overflow-x:hidden; max-height:642px;">
                <div class="card-header">
                    <div class="row gx-2 align-items-center">
                        <div class="col">
                            <span>Hard Reset</span>
                        </div>
                        <div class="col-auto">
                            <button type="button" class="btn btn-primary p-1" @click="popupWipe = false;">
                                <span><i class="fas fa-fw fa-times"></i></span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-12 text-center">
                            <span class="text-danger fw-bold">Are you sure you want to wipe your data?<br>You will lose ALL your progress!</span>
                        </div>
                        <div class="col-12 d-flex justify-content-end">
                            <button type="button" class="btn btn-primary" @click="resetGameData(); popupWipe = false;">
                                <span>Ok</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
        <div v-if="popupVictory" class="position-absolute top-0 bottom-0 start-0 end-0 bg-overlay d-flex align-items-center justify-content-center" style="z-index:100;">
            <div class="card" style="width:380px; overflow-y:auto; overflow-x:hidden; max-height:642px;">
                <div class="card-header">
                    <div class="row gx-2 align-items-center">
                        <div class="col">
                            <span>Victory</span>
                        </div>
                        <div class="col-auto">
                            <button type="button" class="btn btn-primary p-1" @click="game.victory = true; game.paused = false; popupVictory = false;">
                                <span><i class="fas fa-fw fa-times"></i></span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-12 text-center">
                            <span class="text-white h4">!!! Congratulations, You escape !!!</span>
                        </div>
                        <div class="col-12 text-center">
                            <img :src="require(`~/assets/rocketSiloLaunch.gif`)" width="240px" height="240px" alt="Rocket Silo Launch" />
                        </div>
                        <div class="col-12 text-center">
                            <div class="text-normal">You escape from the this hostile planet in</div>
                            <div class="h5 text-white"><FormatTime :value="game.timePlayed" /></div>
                        </div>
                        <div class="col-12 text-center">
                            <span class="text-normal">To be kept informed about other games and the future of this one, join Discord. And if you want to support the job done, please support the Dev!</span>
                        </div>
                        <div class="col-12">
                            <div class="row gx-2 align-items-center justify-content-center">
                                <div class="col-auto">
                                    <a href="https://discord.gg/3UkgeeT9CV" target="_blank" class="btn btn-primary">
                                        <img :src="require(`~/assets/ui/discord.png`)" width="16px" height="16px" alt="Discord" />
                                        <span class="ms-2">Discord</span>
                                    </a>
                                </div>
                                <div class="col">
                                    <button type="button" class="btn btn-primary" @click="popupVictory = null; game.paused = false; showSupportPopup();">
                                        <i class="fas fw fa-hand-holding-heart"></i>
                                        <span class="ms-2">Support</span>
                                    </button>
                                </div>
                                <div class="col-auto">
                                    <button type="button" class="btn btn-primary" @click="game.victory = true; game.paused = false; popupVictory = null;">
                                        <span>Close</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="popupSupport" class="position-absolute top-0 bottom-0 start-0 end-0 bg-overlay d-flex align-items-center justify-content-center" style="z-index:100;">
            <div class="card" style="width:380px; overflow-y:auto; overflow-x:hidden; max-height:642px;">
                <div class="card-header">
                    <div class="row gx-2 align-items-center">
                        <div class="col">
                            <span>Support</span>
                        </div>
                        <div class="col-auto">
                            <button type="button" class="col-auto btn btn-primary p-1" @click="popupSupport = null">
                                <span><i class="fas fa-fw fa-times"></i></span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-12 text-center">
                            <span>I like the donation system because there is nothing forcing you to donate other than out of the goodness of people's hearts. If you like the game and want more content faster, I would be happy to put more time towards this game if I felt that it is paying off.</span>
                        </div>
                        <div class="col-3 text-center">
                            <a href="https://www.patreon.com/bePatron?u=61283131" target="_blank" class="btn btn-primary" style="width:80px;">
                                <div class="col-12"><img :src="require(`~/assets/ui/patreon.png`)" width="24px" height="24px" /></div>
                                <div class="mt-2">Become a supporter</div>
                            </a>
                        </div>
                        <div class="col-3 text-center">
                            <a href="https://ko-fi.com/freddecgames" target="_blank" class="btn btn-primary" style="width:80px;">
                                <div class="col-12"><img :src="require(`~/assets/ui/kofi.png`)" width="24px" height="24px" /></div>
                                <div class="mt-2">Buy me a Ko-fi</div>
                            </a>
                        </div>
                        <form class="col-3 text-center" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
                            <input type="hidden" name="cmd" value="_s-xclick">
                            <input type="hidden" name="hosted_button_id" value="7XYD7SJFKQ8M4">
                            <button type="submit" class="btn btn-primary" style="width:80px;">
                                <div class="col-12"><img :src="require(`~/assets/ui/paypal.png`)" width="24px" height="24px" /></div>
                                <div class="mt-2">Make a donation</div>
                            </button>
                        </form>
                        <div class="col-3 text-center">
                            <a href="https://discord.gg/3UkgeeT9CV" target="_blank" class="btn btn-primary" style="width:80px;">
                                <div class="col-12"><img :src="require(`~/assets/ui/discord.png`)" width="24px" height="24px" alt="Discord" /></div>
                                <div class="mt-2">News and information</div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="popupTutorial" class="position-absolute top-0 bottom-0 start-0 end-0 bg-overlay d-flex align-items-center justify-content-center" style="z-index:100;">
            <div class="card" style="width:380px; overflow-y:auto; overflow-x:hidden; max-height:642px;">
                <div class="card-header">
                    <div class="row gx-2 align-items-center">
                        <div class="col">
                            <span>Tutorial</span>
                        </div>
                        <div class="col-auto">
                            <button type="button" class="col-auto btn btn-primary p-1" @click="popupTutorial = null; disableTutorial();">
                                <span><i class="fas fa-fw fa-times"></i></span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div v-if="popupTutorial.id == 'tut0'" class="row g-3">
                        <div class="col-12 text-center">
                            <span class="text-white h4">Welcome</span>
                        </div>
                        <div class="col-12 text-center">
                            <span class="text-normal">You finally woke up after your crash. You are on an hostile planet and you want to leave as soon as possible.</span>
                            <span class="text-normal">To do that you have to build a <span class="text-white">Rocket</span> from scratch. You have nothing but you could mine resources from this planet.</span>
                            <span class="text-normal">With resources, you build items, machines and perform researches to unlock new items, new machines then discover the recipe to build your <span class="text-white">Rocket</span>.</span>
                        </div>
                        <div class="col-12 text-center">
                            <span class="text-primary">Let me teach you the first steps!<br>You could disable this tutorial. To open it again, click on the button <i class="fas fa-fw fa-question-circle"></i> in the bottom bar of the screen.</span>
                        </div>
                        <div class="col-12 text-center">
                            <div class="alert alert-danger text-center">
                                <div class="fw-bold">Alpha Version</div>
                                <div>This game is still under development with bugs and maybe data lost! Play as your own risks!</div>
                            </div>
                        </div>
                        <div class="col-12 d-flex justify-content-between">
                            <button type="button" class="btn btn-primary" @click="popupTutorial = null; disableTutorial();">
                                <span>Disable</span>
                            </button>
                            <button type="button" class="btn btn-primary" @click="popupTutorial.done = true; popupTutorial = null; showPopupTutorial();">
                                <span>Continue</span>
                            </button>
                        </div>
                    </div>
                    <div v-if="popupTutorial.id == 'tut1'" class="row g-3">
                        <div class="col-12 text-center">
                            <span class="text-white h4">Iron Mining</span>
                        </div>
                        <div class="col-12 text-center">
                            <span class="text-normal"><span class="text-white">Iron</span> is the first ore that you could mine manually. To manually mine ore, you just have to click on <i class="fas fa-fw fa-play"></i> button.</span>
                        </div>
                        <div class="col-12">
                            <div class="text-uppercase text-muted small mb-1">Current Objective</div>
                            <div class="text-normal ps-4 mb-1"><i class="fas fa-fw fa-caret-right"></i> Manually mine 5 <span class="text-white">Iron</span></div>
                        </div>
                        <div class="col-12 d-flex justify-content-between">
                            <button type="button" class="btn btn-primary" @click="popupTutorial = null; disableTutorial();">
                                <span>Disable</span>
                            </button>
                            <button type="button" class="btn btn-primary" @click="popupTutorial = null;">
                                <span>Continue</span>
                            </button>
                        </div>
                    </div>
                    <div v-if="popupTutorial.id == 'tut2'" class="row g-3">
                        <div class="col-12 text-center">
                            <span class="text-white h4">Stone Mining</span>
                        </div>
                        <div class="col-12 text-center">
                            <span class="text-normal">Congrats! You unlock <span class="text-white">Iron Plate</span> and <span class="text-white">Masonry</span> tab. As you see, you cannot produce <span class="text-white">Iron Plate</span> manually. You have to build a <span class="text-white">Furnace</span> to do that. To build a <span class="text-white">Furnace</span> you have to manually mine <span class="text-white">Stone</span>.</span>
                        </div>
                        <div class="col-12">
                            <div class="text-uppercase text-muted small mb-1">Current Objective</div>
                            <div class="text-normal ps-4 mb-1"><i class="fas fa-fw fa-caret-right"></i> Manually mine 5 <span class="text-white">Stone</span></div>
                        </div>
                        <div class="col-12 d-flex justify-content-between">
                            <button type="button" class="btn btn-primary" @click="popupTutorial = null; disableTutorial();">
                                <span>Disable</span>
                            </button>
                            <button type="button" class="btn btn-primary" @click="popupTutorial = null;">
                                <span>Continue</span>
                            </button>
                        </div>
                    </div>
                    <div v-if="popupTutorial.id == 'tut3'" class="row g-3">
                        <div class="col-12 text-center">
                            <span class="text-white h4">Iron Plate Production</span>
                        </div>
                        <div class="col-12 text-center">
                            <span class="text-normal">Now with <span class="text-white">Stone</span>, you could build a <span class="text-white">Furnace</span> to automate <span class="text-white">Iron Plate</span> production.</span>
                        </div>
                        <div class="col-12">
                            <div class="text-uppercase text-muted small mb-1">Current Objective</div>
                            <div class="text-normal ps-4 mb-1"><i class="fas fa-fw fa-caret-right"></i> Build 1 <span class="text-white">Furnace</span> to automate <span class="text-white">Iron Plate</span> production</div>
                        </div>
                        <div class="col-12 d-flex justify-content-between">
                            <button type="button" class="btn btn-primary" @click="popupTutorial = null; disableTutorial();">
                                <span>Disable</span>
                            </button>
                            <button type="button" class="btn btn-primary" @click="popupTutorial = null;">
                                <span>Continue</span>
                            </button>
                        </div>
                    </div>
                    <div v-if="popupTutorial.id == 'tut4'" class="row g-3">
                        <div class="col-12 text-center">
                            <span class="text-white h4">Iron Production</span>
                        </div>
                        <div class="col-12 text-center">
                            <span class="text-normal">Congrats! You automated <span class="text-white">Iron Plate</span> production. If you want you could stop the production by clicking on <i class="fas fa-fw fa-stop"></i> button. Now since your <span class="text-white">Iron Plate</span> production is automated, it is consuming your <span class="text-white">Iron</span> automatically. When there is not enought <span class="text-white">Iron</span> the <i class="text-danger fas fa-fw fa-stop"></i> button will appear: this means there is a lack of input resource to produce automatically.</span>
                        </div>
                        <div class="col-12 text-center">
                            <span class="text-normal">So to continue to produce <span class="text-white">Iron Plate</span> automatically, you have to produce <span class="text-white">Iron</span> automatically too. To do that you have to build a <span class="text-white">Mining Drill</span>.</span>
                        </div>
                        <div class="col-12">
                            <div class="text-uppercase text-muted small mb-1">Current Objective</div>
                            <div class="text-normal ps-4 mb-1"><i class="fas fa-fw fa-caret-right"></i> Mine manually <span class="text-white">Stone</span> and <span class="text-white">Iron</span> to have enough <span class="text-white">Iron Plate</span></div>
                            <div class="text-normal ps-4 mb-1"><i class="fas fa-fw fa-caret-right"></i> Build 1 <span class="text-white">Mining Drill</span></div>
                        </div>
                        <div class="col-12 d-flex justify-content-between">
                            <button type="button" class="btn btn-primary" @click="popupTutorial = null; disableTutorial();">
                                <span>Disable</span>
                            </button>
                            <button type="button" class="btn btn-primary" @click="popupTutorial = null;">
                                <span>Continue</span>
                            </button>
                        </div>
                    </div>
                    <div v-if="popupTutorial.id == 'tut5'" class="row g-3">
                        <div class="col-12 text-center">
                            <span class="text-white h4">Stone Production</span>
                        </div>
                        <div class="col-12 text-center">
                            <span class="text-normal">Now your <span class="text-white">Iron</span> production chain is fully automated! Let's do the same for the <span class="text-white">Stone</span> chain.</span>
                        </div>
                        <div class="col-12">
                            <div class="text-uppercase text-muted small mb-1">Current Objective</div>
                            <div class="text-normal ps-4 mb-1"><i class="fas fa-fw fa-caret-right"></i> Build 1 <span class="text-white">Mining Drill</span> to automate <span class="text-white">Stone</span> production</div>
                        </div>
                        <div class="col-12 d-flex justify-content-between">
                            <button type="button" class="btn btn-primary" @click="popupTutorial = null; disableTutorial();">
                                <span>Disable</span>
                            </button>
                            <button type="button" class="btn btn-primary" @click="popupTutorial = null;">
                                <span>Continue</span>
                            </button>
                        </div>
                    </div>
                    <div v-if="popupTutorial.id == 'tut6'" class="row g-3">
                        <div class="col-12 text-center">
                            <span class="text-white h4">Copper Production Chain</span>
                        </div>
                        <div class="col-12 text-center">
                            <span class="text-normal">You made a big step to escape from this hostile planet : your <span class="text-white">Iron</span> and <span class="text-white">Stone</span> chains are both automated!</span>
                        </div>
                        <div class="col-12 text-center">
                            <span class="text-normal">You just unlocked the <span class="text-white">Copper</span> production chain. Let's automate it.</span>
                        </div>
                        <div class="col-12">
                            <div class="text-uppercase text-muted small mb-1">Current Objective</div>
                            <div class="text-normal ps-4 mb-1"><i class="fas fa-fw fa-caret-right"></i> Build 1 <span class="text-white">Mining Drill</span> to automate <span class="text-white">Copper</span> production</div>
                            <div class="text-normal ps-4 mb-1"><i class="fas fa-fw fa-caret-right"></i> Build 1 <span class="text-white">Furnace</span> to automate <span class="text-white">Copper Plate</span> production</div>
                        </div>
                        <div class="col-12 d-flex justify-content-between">
                            <button type="button" class="btn btn-primary" @click="popupTutorial = null; disableTutorial();">
                                <span>Disable</span>
                            </button>
                            <button type="button" class="btn btn-primary" @click="popupTutorial = null;">
                                <span>Continue</span>
                            </button>
                        </div>
                    </div>
                    <div v-if="popupTutorial.id == 'tut7'" class="row g-3">
                        <div class="col-12 text-center">
                            <span class="text-white h4">Labs</span>
                        </div>
                        <div class="col-12 text-center">
                            <span class="text-normal">Perfect! Productions are automated so now we have to focus on researching new productions to build the <span class="text-white">Rocket</span>.</span>
                        </div>
                        <div class="col-12 text-center">
                            <span class="text-normal">Researches are performed in <span class="text-white">Lab</span>: one research at a time. The more <span class="text-white">Labs</span> you have, the quicker you could perform a research.</span>
                        </div>
                        <div class="col-12">
                            <div class="text-uppercase text-muted small mb-1">Current Objective</div>
                            <div class="text-normal ps-4 mb-1"><i class="fas fa-fw fa-caret-right"></i> Build 1 <span class="text-white">Lab</span> to be able to perform researches</div>
                        </div>
                        <div class="col-12 d-flex justify-content-between">
                            <button type="button" class="btn btn-primary" @click="popupTutorial = null; disableTutorial();">
                                <span>Disable</span>
                            </button>
                            <button type="button" class="btn btn-primary" @click="popupTutorial = null;">
                                <span>Continue</span>
                            </button>
                        </div>
                    </div>
                    <div v-if="popupTutorial.id == 'tut8'" class="row g-3">
                        <div class="col-12 text-center">
                            <span class="text-white h4">Packs and Researches</span>
                        </div>
                        <div class="col-12 text-center">
                            <span class="text-normal">With one Lab you are able to perform researches and to produce packs.</span>
                        </div>
                        <div class="col-12 text-center">
                            <span class="text-normal">Each research needs packs to be performed. Each research unlocks new productions, new buildings or new researches. The first available research is <span class="text-white">Automation 1</span> that will unlock assembler 1 buildings and tier 1 storages.</span>
                        </div>
                        <div class="col-12">
                            <div class="text-uppercase text-muted small mb-1">Current Objective</div>
                            <div class="text-normal ps-4 mb-1"><i class="fas fa-fw fa-caret-right"></i> Produce 10 <span class="text-white">Red Packs</span></div>
                            <div class="text-normal ps-4 mb-1"><i class="fas fa-fw fa-caret-right"></i> Research <span class="text-white">Automation 1</span></div>
                        </div>
                        <div class="col-12 d-flex justify-content-between">
                            <button type="button" class="btn btn-primary" @click="popupTutorial = null; disableTutorial();">
                                <span>Disable</span>
                            </button>
                            <button type="button" class="btn btn-primary" @click="popupTutorial = null;">
                                <span>Continue</span>
                            </button>
                        </div>
                    </div>
                    <div v-if="popupTutorial.id == 'tut9'" class="row g-3">
                        <div class="col-12 text-center">
                            <span class="text-white h4">Military and Weapons</span>
                        </div>
                        <div class="col-12 text-center">
                            <span class="text-normal">You unlocked <span class="text-white">Assembler</span> buildings that allow you to automate packs production. You unlocked new resaerches too.</span>
                        </div>
                        <div class="col-12 text-center">
                            <span class="text-normal">You are on an hostile planet so you have to defend yourself from <span class="text-white">Aliens</span>. For that you have to produce weapons and ammunitions.</span>
                        </div>
                        <div class="col-12">
                            <div class="text-uppercase text-muted small mb-1">Current Objective</div>
                            <div class="text-normal ps-4 mb-1"><i class="fas fa-fw fa-caret-right"></i> Research <span class="text-white">Military 1</span></div>
                        </div>
                        <div class="col-12 d-flex justify-content-between">
                            <button type="button" class="btn btn-primary" @click="popupTutorial = null; disableTutorial();">
                                <span>Disable</span>
                            </button>
                            <button type="button" class="btn btn-primary" @click="popupTutorial = null;">
                                <span>Continue</span>
                            </button>
                        </div>
                    </div>
                    <div v-if="popupTutorial.id == 'tut10'" class="row g-3">
                        <div class="col-12 text-center">
                            <span class="text-white h4">Alien Eggs</span>
                        </div>
                        <div class="col-12 text-center">
                            <span class="text-normal">Now you are able to build weapons and produce ammunitions. Moreover you could generate aliens to collect <span class="text-white">Alien Eggs</span> by killing them with weapons and ammunitions.</span>
                        </div>
                        <div class="col-12 text-center">
                            <span class="text-normal"><span class="text-white">Alien Eggs</span> are mandatory to produce some items and are used to speed up machine production.</span>
                        </div>
                        <div class="col-12">
                            <div class="text-uppercase text-muted small mb-1">Current Objective</div>
                            <div class="text-normal ps-4 mb-1"><i class="fas fa-fw fa-caret-right"></i> Build a <span class="text-white">Pistol</span></div>
                            <div class="text-normal ps-4 mb-1"><i class="fas fa-fw fa-caret-right"></i> Produce <span class="text-white">Bullets</span></div>
                            <div class="text-normal ps-4 mb-1"><i class="fas fa-fw fa-caret-right"></i> Collect 1 <span class="text-white">Alien Egg</span> by killing aliens</div>
                        </div>
                        <div class="col-12 d-flex justify-content-between">
                            <button type="button" class="btn btn-primary" @click="popupTutorial = null; disableTutorial();">
                                <span>Disable</span>
                            </button>
                            <button type="button" class="btn btn-primary" @click="popupTutorial = null;">
                                <span>Continue</span>
                            </button>
                        </div>
                    </div>
                    <div v-if="popupTutorial.id == 'tut11'" class="row g-3">
                        <div class="col-12 text-center">
                            <span class="text-white h4">End of Tutorial</span>
                        </div>
                        <div class="col-12 text-center">
                            <span class="text-normal">Congratulations for your first <span class="text-white">Alien Egg</span>!</span>
                        </div>
                        <div class="col-12 text-center">
                            <span class="text-normal">So now, you know what to do to build <span class="text-white">Rocket</span> and to escape from this hostile planet: produce packs, perform researches, unlock new productions, use <span class="text-white">Alien Eggs</span> to improve machines and finally produce more items!</span>
                        </div>
                        <div class="col-12">
                            <div class="text-uppercase text-muted small mb-1">Final Objective</div>
                            <div class="text-normal ps-4 mb-1"><i class="fas fa-fw fa-caret-right"></i> Build 100 <span class="text-white">Rocket Parts</span></div>
                        </div>
                        <div class="col-12 text-center">
                            <span class="text-white h5">Good luck!</span>
                        </div>
                        <div class="col-12 text-center">
                            <span class="text-normal">To be kept informed about other games and the future of this one, join Discord. And if you want to support the job done, please support the Dev!</span>
                        </div>
                        <div class="col-12">
                            <div class="row gx-2 align-items-center">
                                <div class="col-auto">
                                    <a href="https://discord.gg/3UkgeeT9CV" target="_blank" class="btn btn-primary">
                                        <img :src="require(`~/assets/ui/discord.png`)" width="16px" height="16px" alt="Discord" />
                                        <span class="ms-2">Discord</span>
                                    </a>
                                </div>
                                <div class="col">
                                    <button type="button" class="btn btn-primary" @click="popupTutorial.done = true; popupTutorial = null; showSupportPopup();">
                                        <i class="fas fw fa-hand-holding-heart"></i>
                                        <span class="ms-2">Support</span>
                                    </button>
                                </div>
                                <div class="col-auto">
                                    <button type="button" class="btn btn-primary" @click="popupTutorial.done = true; popupTutorial = null; disableTutorial();">
                                        <span>Close</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="popupOffline" class="position-absolute top-0 bottom-0 start-0 end-0 bg-overlay d-flex align-items-center justify-content-center" style="z-index:100;">
            <div class="card" style="width:380px; overflow-y:auto; overflow-x:hidden; max-height:642px;">
                <div class="card-header">
                    <div class="row gx-2 align-items-center">
                        <div class="col">
                            <span>Offline Gains</span>
                        </div>
                        <div class="col-auto">
                            <button type="button" class="btn btn-primary p-1" @click="popupOffline = null;">
                                <span><i class="fas fa-fw fa-times"></i></span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-12 text-center">
                            <div class="text-normal">You were away</div>
                            <div class="h5 text-white"><FormatTime :value="popupOffline / 1000" /></div>
                        </div>
                        <div class="col-12 text-center">
                            <small>Offline gains are limited to 24 hours</small>
                        </div>
                        <div class="col-12">
                            <div class="row gx-2 align-items-center justify-content-center">
                                <div class="col-auto">
                                    <button type="button" class="btn btn-primary" @click="popupOffline = null;">
                                        <span>Close</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="popupAlien" class="position-absolute top-0 bottom-0 start-0 end-0 bg-overlay d-flex align-items-center justify-content-center" style="z-index:100;">
            <div class="card" style="width:380px; overflow-y:auto; overflow-x:hidden; max-height:642px;">
                <div class="card-header">
                    <div class="row gx-2 align-items-center">
                        <div class="col">
                            <span>Alien</span>
                        </div>
                        <div class="col-auto">
                            <button type="button" class="btn btn-primary p-1" @click="popupAlien = null;">
                                <span><i class="fas fa-fw fa-times"></i></span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-12">
                            <div class="row gx-2">
                                <div class="col-auto">
                                    <img :src="require(`~/assets/aliens/${popupAlien.id}.png`)" width="48px" height="48px" :alt="$t('alien_' + popupAlien.id)" />
                                </div>
                                <div class="col">
                                    <div class="text-white h5">{{ $t('alien_' + popupAlien.id) }}</div>
                                    <div class="mt-1 text-muted">{{ $t('alienDesc_' + popupAlien.id) }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="subtitle">Info</div>
                            <table class="table">
                                <tbody>
                                    <tr>
                                        <td>Health</td>
                                        <td nowrap colspan="2" class="text-end"><FormatNumber :value="popupAlien.health" /></td>
                                    </tr>
                                    <tr>
                                        <td>Armor</td>
                                        <td nowrap class="text-end"><FormatNumber :value="popupAlien.armor.physical * 100" /> % <small class="text-muted">physical</small></td>
                                        <td nowrap class="text-end"><FormatNumber :value="popupAlien.armor.explosion * 100" /> % <small class="text-muted">explosion</small></td>
                                    </tr>
                                    <tr>
                                        <td>Shield</td>
                                        <td nowrap class="text-end"><FormatNumber :value="popupAlien.shield.physical" /> <small class="text-muted">physical</small></td>
                                        <td nowrap class="text-end"><FormatNumber :value="popupAlien.shield.explosion" /> <small class="text-muted">explosion</small></td>
                                    </tr>
                                    <tr v-if="popupAlien.eggCoeff < 1.0" >
                                        <td>Egg Chance</td>
                                        <td nowrap colspan="2" class="text-end"><FormatNumber :value="100 - popupAlien.eggCoeff * 100" /> %</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="col-12">
                            <div class="row gx-2 align-items-center justify-content-end">
                                <div class="col-auto">
                                    <button type="button" class="btn btn-primary" @click="popupAlien = null;">
                                        <span>Close</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isMobile == false && started == false" class="position-absolute bg-grid top-0 bottom-0 start-0 end-0 d-flex align-items-center justify-content-center">
            <div class="p-3">
                <div class="row g-3">
                    <div class="col-12 text-center"><img :src="require(`~/assets/icon.png`)" width="36px" class="rounded" /></div>
                    <div class="col-12 text-normal text-center h5">FG Factory</div>
                    <div v-if="error == null" class="col-12 flicker text-primary text-center">Initializing game...</div>
                    <div v-if="error != null" class="col-12 text-center">
                        <div class="row g-3">
                            <div class="col-12 text-center">
                                <div class="text-danger">An error occured during game loading</div>
                                <div class="text-danger">"{{ this.error }}"</div>
                            </div>
                            <div class="col-12">
                                <span class="text-normal">To ask for help, you could contact <span class="text-white">Freddec</span> on Discord with following exported data</span>
                            </div>
                            <div class="col-12 d-flex justify-content-center">
                                <a href="https://discord.gg/3UkgeeT9CV" target="_blank" class="btn btn-primary">
                                    <img :src="require(`~/assets/ui/discord.png`)" width="16px" height="16px" alt="Discord" />
                                    <span class="ms-2">Discord</span>
                                </a>
                            </div>
                            <div class="col-12">
                                <textarea spellcheck="false" rows="5" class="w-100 rounded bg-1 border-0 text-normal p-2" style="max-width:512px;">{{ exportGameData }}</textarea>
                            </div>
                            <div class="col-12">
                                <span class="text-normal">Or you could wipe your local data to restart the game at the beginning</span>
                            </div>
                            <div class="col-12 d-flex justify-content-center">
                                <button type="button" class="btn btn-primary text-danger" @click="showWipeDataPopup()">
                                    <span><i class="fas fa-fw fa-skull"></i></span>
                                    <span class="ms-2">Wipe Local Data</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div v-if="isMobile == false && started == true" class="w-100 h-100 position-relative">
            
            <div class="position-fixed top-0 start-0 end-0 bg-2 d-flex align-items-center" style="height:50px;">
                <div class="container">
                    <div class="row gx-2 align-items-center py-1">
                        <div class="col-auto">
                            <img :src="require(`~/assets/icon.png`)" width="20px" />
                        </div>
                        <div class="col-auto">
                            <span class="h5">FG Factory</span>
                        </div>
                        <div class="col">
                            <span class="badge badge-danger">Alpha version</span>
                        </div>
                        <div class="col-auto">
                            <small class="fw-bold text-primary">{{ $t('mode_' + game.currentMode) }}</small>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="position-fixed start-0 end-0 nav bg-1 d-flex align-items-end" style="top:50px; height:55px;">
                <div class="container">
                    <div class="row gx-0 align-items-center">
                        <TopMenuTab v-if="gameBase('iron').unlocked == true" tabId="production" icon="fa-drum-steelpan" />
                        <TopMenuTab v-if="game.lab.unlocked == true" tabId="techs" icon="fa-flask" />
                        <TopMenuTab v-if="gameBase('bullet').unlocked == true" tabId="weapons" icon="fa-burn">
                            <div class="position-absolute top-0 end-0">
                                <div class="badge">
                                    <div class="row g-0 align-items-center">
                                        <div class="col-auto">
                                            <img :src="require(`~/assets/vignets/alienEgg.png`)" width="12px" height="12px" :title="$t('name_alienEgg')" :alt="$t('name_alienEgg')" />
                                        </div>
                                        <div class="col-auto">
                                            <span class="text-shadow"><FormatNumber :value="game.bases['alienEgg'].count" :class="{ 'text-full':game.bases['alienEgg'].count >= game.getAlienEggMax() }" /></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TopMenuTab>
                        <TopMenuTab tabId="trophies" icon="fa-trophy" class="ms-auto" />
                        <TopMenuTab tabId="settings" icon="fa-cogs" />
                    </div>
                </div>
            </div>
            
            <div v-if="currentTabId == 'production'" class="position-fixed top-0 bottom-0 start-0 end-0" style="margin-top:105px; margin-bottom:50px;">
                <div class="container py-3 scrollbar">
                    <div class="row gx-4 scrollbar">
                        <div class="col scrollbar">
                            <div class="row g-3">
                            
                                <Category v-if="gameBase('steam') && gameBase('steam').unlocked == true" id="energy" :show="catEnergyOpen" @click="catEnergyOpen = !catEnergyOpen;">
                                    <ButtonItem :item="gameBase('steam')" @click="setCurrentProductionPageId('steam')" :active="currentProductionPageId == 'steam'" />
                                    <ButtonItem :item="gameBase('electricity')" @click="setCurrentProductionPageId('electricity')" :active="currentProductionPageId == 'electricity'" />
                                </Category>
                                
                                <Category v-if="gameBase('iron').unlocked == true" id="ironwork" :show="catIronworkOpen" @click="catIronworkOpen = !catIronworkOpen;">
                                    <ButtonItem :item="gameBase('coal')" @click="setCurrentProductionPageId('coal')" :active="currentProductionPageId == 'coal'" />
                                    <ButtonItem :item="gameBase('iron')" @click="setCurrentProductionPageId('iron')" :active="currentProductionPageId == 'iron'" />
                                    <ButtonItem :item="gameBase('ironPlate')" @click="setCurrentProductionPageId('ironPlate')" :active="currentProductionPageId == 'ironPlate'" />
                                    <ButtonItem :item="gameBase('pipe')" @click="setCurrentProductionPageId('pipe')" :active="currentProductionPageId == 'pipe'" />
                                    <ButtonItem :item="gameBase('ironStick')" @click="setCurrentProductionPageId('ironStick')" :active="currentProductionPageId == 'ironStick'" />
                                    <ButtonItem :item="gameBase('ironGearWheel')" @click="setCurrentProductionPageId('ironGearWheel')" :active="currentProductionPageId == 'ironGearWheel'" />
                                    <ButtonItem :item="gameBase('steelPlate')" @click="setCurrentProductionPageId('steelPlate')" :active="currentProductionPageId == 'steelPlate'" />
                                    <ButtonItem :item="gameBase('engine')" @click="setCurrentProductionPageId('engine')" :active="currentProductionPageId == 'engine'" />
                                    <ButtonItem :item="gameBase('electricEngine')" @click="setCurrentProductionPageId('electricEngine')" :active="currentProductionPageId == 'electricEngine'" />
                                    <ButtonItem :item="gameBase('rail')" @click="setCurrentProductionPageId('rail')" :active="currentProductionPageId == 'rail'" />
                                    <ButtonItem :item="gameBase('grenade')" @click="setCurrentProductionPageId('grenade')" :active="currentProductionPageId == 'grenade'" />
                                    <ButtonItem :item="gameBase('radar')" @click="setCurrentProductionPageId('radar')" :active="currentProductionPageId == 'radar'" />
                                    <ButtonItem :item="gameBase('exoskeleton')" @click="setCurrentProductionPageId('exoskeleton')" :active="currentProductionPageId == 'exoskeleton'" />
                                </Category>
                                
                                <Category v-if="gameBase('uranium') && gameBase('uranium').unlocked == true" id="uranium" :show="catUraniumOpen" @click="catUraniumOpen = !catUraniumOpen;">
                                    <ButtonItem :item="gameBase('uranium')" @click="setCurrentProductionPageId('uranium')" :active="currentProductionPageId == 'uranium'" />
                                    <ButtonItem :item="gameBase('uranium235')" @click="setCurrentProductionPageId('uranium235')" :active="currentProductionPageId == 'uranium235'" />
                                    <ButtonItem :item="gameBase('uranium238')" @click="setCurrentProductionPageId('uranium238')" :active="currentProductionPageId == 'uranium238'" />
                                </Category>
                                
                                <Category v-if="gameBase('stone').unlocked == true" id="masonry" :show="catMasonryOpen" @click="catMasonryOpen = !catMasonryOpen;">
                                    <ButtonItem :item="gameBase('stone')" @click="setCurrentProductionPageId('stone')" :active="currentProductionPageId == 'stone'" />
                                    <ButtonItem :item="gameBase('stoneBrick')" @click="setCurrentProductionPageId('stoneBrick')" :active="currentProductionPageId == 'stoneBrick'" />
                                    <ButtonItem :item="gameBase('wall')" @click="setCurrentProductionPageId('wall')" :active="currentProductionPageId == 'wall'" />
                                    <ButtonItem :item="gameBase('concrete')" @click="setCurrentProductionPageId('concrete')" :active="currentProductionPageId == 'concrete'" />
                                </Category>
                                
                                <Category v-if="gameBase('copper').unlocked == true" id="electronic" :show="catElectronicOpen" @click="catElectronicOpen = !catElectronicOpen;">
                                    <ButtonItem :item="gameBase('copper')" @click="setCurrentProductionPageId('copper')" :active="currentProductionPageId == 'copper'" />
                                    <ButtonItem :item="gameBase('copperPlate')" @click="setCurrentProductionPageId('copperPlate')" :active="currentProductionPageId == 'copperPlate'" />
                                    <ButtonItem :item="gameBase('copperCable')" @click="setCurrentProductionPageId('copperCable')" :active="currentProductionPageId == 'copperCable'" />
                                    <ButtonItem :item="gameBase('electronicCircuit')" @click="setCurrentProductionPageId('electronicCircuit')" :active="currentProductionPageId == 'electronicCircuit'" />
                                    <ButtonItem :item="gameBase('advancedCircuit')" @click="setCurrentProductionPageId('advancedCircuit')" :active="currentProductionPageId == 'advancedCircuit'" />
                                    <ButtonItem :item="gameBase('processingUnit')" @click="setCurrentProductionPageId('processingUnit')" :active="currentProductionPageId == 'processingUnit'" />
                                    <ButtonItem :item="gameBase('solarPanel')" @click="setCurrentProductionPageId('solarPanel')" :active="currentProductionPageId == 'solarPanel'" />
                                    <ButtonItem :item="gameBase('flyingRobot')" @click="setCurrentProductionPageId('flyingRobot')" :active="currentProductionPageId == 'flyingRobot'" />
                                    <ButtonItem :item="gameBase('portableReactor')" @click="setCurrentProductionPageId('portableReactor')" :active="currentProductionPageId == 'portableReactor'" />
                                </Category>
                                
                                <Category v-if="gameBase('redPack').unlocked == true" id="tech" :show="catTechOpen" @click="catTechOpen = !catTechOpen;">
                                    <ButtonItem :item="gameBase('redPack')" @click="setCurrentProductionPageId('redPack')" :active="currentProductionPageId == 'redPack'" />
                                    <ButtonItem :item="gameBase('greenPack')" @click="setCurrentProductionPageId('greenPack')" :active="currentProductionPageId == 'greenPack'" />
                                    <ButtonItem :item="gameBase('grayPack')" @click="setCurrentProductionPageId('grayPack')" :active="currentProductionPageId == 'grayPack'" />
                                    <ButtonItem :item="gameBase('bluePack')" @click="setCurrentProductionPageId('bluePack')" :active="currentProductionPageId == 'bluePack'" />
                                    <ButtonItem :item="gameBase('purplePack')" @click="setCurrentProductionPageId('purplePack')" :active="currentProductionPageId == 'purplePack'" />
                                    <ButtonItem :item="gameBase('yellowPack')" @click="setCurrentProductionPageId('yellowPack')" :active="currentProductionPageId == 'yellowPack'" />
                                </Category>

                                <Category v-if="gameBase('bullet').unlocked == true" id="ammunition" :show="catAmmunitionOpen" @click="catAmmunitionOpen = !catAmmunitionOpen;">
                                    <ButtonItem :item="gameBase('bullet')" @click="setCurrentProductionPageId('bullet')" :active="currentProductionPageId == 'bullet'" />
                                    <ButtonItem :item="gameBase('bulletPiercing')" @click="setCurrentProductionPageId('bulletPiercing')" :active="currentProductionPageId == 'bulletPiercing'" />
                                    <ButtonItem :item="gameBase('bulletUranium')" @click="setCurrentProductionPageId('bulletUranium')" :active="currentProductionPageId == 'bulletUranium'" />
                                    <ButtonItem :item="gameBase('shotgunShell')" @click="setCurrentProductionPageId('shotgunShell')" :active="currentProductionPageId == 'shotgunShell'" />
                                    <ButtonItem :item="gameBase('piercingShell')" @click="setCurrentProductionPageId('piercingShell')" :active="currentProductionPageId == 'piercingShell'" />
                                    <ButtonItem :item="gameBase('cannonShell')" @click="setCurrentProductionPageId('cannonShell')" :active="currentProductionPageId == 'cannonShell'" />
                                    <ButtonItem :item="gameBase('explosiveShell')" @click="setCurrentProductionPageId('explosiveShell')" :active="currentProductionPageId == 'explosiveShell'" />
                                    <ButtonItem :item="gameBase('uraniumShell')" @click="setCurrentProductionPageId('uraniumShell')" :active="currentProductionPageId == 'uraniumShell'" />
                                    <ButtonItem :item="gameBase('rocket')" @click="setCurrentProductionPageId('rocket')" :active="currentProductionPageId == 'rocket'" />
                                    <ButtonItem :item="gameBase('explosiveRocket')" @click="setCurrentProductionPageId('explosiveRocket')" :active="currentProductionPageId == 'explosiveRocket'" />
                                    <ButtonItem :item="gameBase('atomicBomb')" @click="setCurrentProductionPageId('atomicBomb')" :active="currentProductionPageId == 'atomicBomb'" />
                                    <ButtonItem :item="gameBase('artilleryShell')" @click="setCurrentProductionPageId('artilleryShell')" :active="currentProductionPageId == 'artilleryShell'" />
                                </Category>

                                <Category v-if="gameBase('speedModule') && gameBase('speedModule').unlocked == true" id="module" :show="catModuleOpen" @click="catModuleOpen = !catModuleOpen;">
                                    <ButtonItem :item="gameBase('speedModule')" @click="setCurrentProductionPageId('speedModule')" :active="currentProductionPageId == 'speedModule'" />
                                    <ButtonItem :item="gameBase('efficiencyModule')" @click="setCurrentProductionPageId('efficiencyModule')" :active="currentProductionPageId == 'efficiencyModule'" />
                                    <ButtonItem :item="gameBase('productivityModule')" @click="setCurrentProductionPageId('productivityModule')" :active="currentProductionPageId == 'productivityModule'" />
                                </Category>
                                        
                                <Category v-if="gameBase('water').unlocked == true" id="chemistry" :show="catChemistryOpen" @click="catChemistryOpen = !catChemistryOpen;">
                                    <ButtonItem :item="gameBase('water')" @click="setCurrentProductionPageId('water')" :active="currentProductionPageId == 'water'" />
                                    <ButtonItem :item="gameBase('oil')" @click="setCurrentProductionPageId('oil')"  :active="currentProductionPageId == 'oil'" />
                                    <ButtonItem :item="gameBase('heavyOil')" @click="setCurrentProductionPageId('heavyOil')" :active="currentProductionPageId == 'heavyOil'" />
                                    <ButtonItem :item="gameBase('lubricant')" @click="setCurrentProductionPageId('lubricant')" :active="currentProductionPageId == 'lubricant'" />
                                    <ButtonItem :item="gameBase('lightOil')" @click="setCurrentProductionPageId('lightOil')" :active="currentProductionPageId == 'lightOil'" />
                                    <ButtonItem :item="gameBase('petroleumGas')" @click="setCurrentProductionPageId('petroleumGas')" :active="currentProductionPageId == 'petroleumGas'" />
                                    <ButtonItem :item="gameBase('plasticBar')" @click="setCurrentProductionPageId('plasticBar')" :active="currentProductionPageId == 'plasticBar'" />
                                    <ButtonItem :item="gameBase('solidFuel')" @click="setCurrentProductionPageId('solidFuel')" :active="currentProductionPageId == 'solidFuel'" />
                                    <ButtonItem :item="gameBase('sulfur')" @click="setCurrentProductionPageId('sulfur')" :active="currentProductionPageId == 'sulfur'" />
                                    <ButtonItem :item="gameBase('sulfuricAcid')" @click="setCurrentProductionPageId('sulfuricAcid')" :active="currentProductionPageId == 'sulfuricAcid'" />
                                    <ButtonItem :item="gameBase('battery')" @click="setCurrentProductionPageId('battery')" :active="currentProductionPageId == 'battery'" />
                                    <ButtonItem :item="gameBase('explosive')" @click="setCurrentProductionPageId('explosive')" :active="currentProductionPageId == 'explosive'" />
                                    <ButtonItem :item="gameBase('accumulator')" @click="setCurrentProductionPageId('accumulator')" :active="currentProductionPageId == 'accumulator'" />
                                </Category>
                                
                                <Category v-if="gameBase('rocketFuel').unlocked == true" id="rocket" :show="catRocketOpen" @click="catRocketOpen = !catRocketOpen;">
                                    <ButtonItem :item="gameBase('rocketFuel')" @click="setCurrentProductionPageId('rocketFuel')" :active="currentProductionPageId == 'rocketFuel'" />
                                    <ButtonItem :item="gameBase('rocketControlUnit')" @click="setCurrentProductionPageId('rocketControlUnit')" :active="currentProductionPageId == 'rocketControlUnit'" />
                                    <ButtonItem :item="gameBase('lowDensityStructure')" @click="setCurrentProductionPageId('lowDensityStructure')" :active="currentProductionPageId == 'lowDensityStructure'" />
                                    <ButtonItem :item="gameBase('rocketPart')" @click="setCurrentProductionPageId('rocketPart')" :active="currentProductionPageId == 'rocketPart'" />
                                    <ButtonItem :item="gameBase('satellite')" @click="setCurrentProductionPageId('satellite')" :active="currentProductionPageId == 'satellite'" />
                                </Category>
                                
                            </div>
                        </div>
                        
                        <PageItem v-if="currentProductionPageId == 'steam'" :item="gameBase('steam')" />
                        <PageItem v-if="currentProductionPageId == 'electricity'" :item="gameBase('electricity')" />
                        <PageItem v-if="currentProductionPageId == 'coal'" :item="gameBase('coal')" />
                        <PageItem v-if="currentProductionPageId == 'iron'" :item="gameBase('iron')" />
                        <PageItem v-if="currentProductionPageId == 'ironPlate'" :item="gameBase('ironPlate')" />
                        <PageItem v-if="currentProductionPageId == 'pipe'" :item="gameBase('pipe')" />
                        <PageItem v-if="currentProductionPageId == 'ironGearWheel'" :item="gameBase('ironGearWheel')" />
                        <PageItem v-if="currentProductionPageId == 'steelPlate'" :item="gameBase('steelPlate')" />
                        <PageItem v-if="currentProductionPageId == 'engine'" :item="gameBase('engine')" />
                        <PageItem v-if="currentProductionPageId == 'electricEngine'" :item="gameBase('electricEngine')" />
                        <PageItem v-if="currentProductionPageId == 'stone'" :item="gameBase('stone')" />
                        <PageItem v-if="currentProductionPageId == 'stoneBrick'" :item="gameBase('stoneBrick')" />
                        <PageItem v-if="currentProductionPageId == 'concrete'" :item="gameBase('concrete')" />
                        <PageItem v-if="currentProductionPageId == 'copper'" :item="gameBase('copper')" />
                        <PageItem v-if="currentProductionPageId == 'copperPlate'" :item="gameBase('copperPlate')" />
                        <PageItem v-if="currentProductionPageId == 'electronicCircuit'" :item="gameBase('electronicCircuit')" />
                        <PageItem v-if="currentProductionPageId == 'processingUnit'" :item="gameBase('processingUnit')" />
                        <PageItem v-if="currentProductionPageId == 'redPack'" :item="gameBase('redPack')" />
                        <PageItem v-if="currentProductionPageId == 'greenPack'" :item="gameBase('greenPack')" />
                        <PageItem v-if="currentProductionPageId == 'bluePack'" :item="gameBase('bluePack')" />
                        <PageItem v-if="currentProductionPageId == 'purplePack'" :item="gameBase('purplePack')" />
                        <PageItem v-if="currentProductionPageId == 'yellowPack'" :item="gameBase('yellowPack')" />
                        <PageItem v-if="currentProductionPageId == 'grayPack'" :item="gameBase('grayPack')" />
                        <PageItem v-if="currentProductionPageId == 'bullet'" :item="gameBase('bullet')" />
                        <PageItem v-if="currentProductionPageId == 'bulletPiercing'" :item="gameBase('bulletPiercing')" />
                        <PageItem v-if="currentProductionPageId == 'shotgunShell'" :item="gameBase('shotgunShell')" />
                        <PageItem v-if="currentProductionPageId == 'piercingShell'" :item="gameBase('piercingShell')" />
                        <PageItem v-if="currentProductionPageId == 'rocket'" :item="gameBase('rocket')" />
                        <PageItem v-if="currentProductionPageId == 'explosiveRocket'" :item="gameBase('explosiveRocket')" />
                        <PageItem v-if="currentProductionPageId == 'artilleryShell'" :item="gameBase('artilleryShell')" />
                        <PageItem v-if="currentProductionPageId == 'water'" :item="gameBase('water')" />
                        <PageItem v-if="currentProductionPageId == 'oil'" :item="gameBase('oil')" />
                        <PageItem v-if="currentProductionPageId == 'heavyOil'" :item="gameBase('heavyOil')" />
                        <PageItem v-if="currentProductionPageId == 'lubricant'" :item="gameBase('lubricant')" />
                        <PageItem v-if="currentProductionPageId == 'lightOil'" :item="gameBase('lightOil')" />
                        <PageItem v-if="currentProductionPageId == 'petroleumGas'" :item="gameBase('petroleumGas')" />
                        <PageItem v-if="currentProductionPageId == 'plasticBar'" :item="gameBase('plasticBar')" />
                        <PageItem v-if="currentProductionPageId == 'solidFuel'" :item="gameBase('solidFuel')" />
                        <PageItem v-if="currentProductionPageId == 'sulfur'" :item="gameBase('sulfur')" />
                        <PageItem v-if="currentProductionPageId == 'sulfuricAcid'" :item="gameBase('sulfuricAcid')" />
                        <PageItem v-if="currentProductionPageId == 'battery'" :item="gameBase('battery')" />
                        <PageItem v-if="currentProductionPageId == 'explosive'" :item="gameBase('explosive')" />
                        <PageItem v-if="currentProductionPageId == 'rocketFuel'" :item="gameBase('rocketFuel')" />
                        <PageItem v-if="currentProductionPageId == 'rocketPart'" :item="gameBase('rocketPart')" />
                        
                    </div>
                </div>
            </div>

            <div v-if="currentTabId == 'techs' && game.lab.unlocked == true" class="position-fixed top-0 bottom-0 start-0 end-0" style="margin-top:105px; margin-bottom:50px;">
                <div class="container py-3 scrollbar">
                    <div class="row gx-4 scrollbar">
                        <div class="col-auto scrollbar" style="width:425px;">
                            <div class="row g-3">
                                <div class="col-12">
                                    <div class="row g-3">
                                        <ButtonItemCount :item="game.lab" @click="setCurrentTechPageId('lab')" :active="currentTechPageId == 'lab'" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <PageLab v-if="currentTechPageId == 'lab'" :lab="game.lab" />
                        
                    </div>
                </div>
            </div>            

            <div v-if="currentTabId == 'weapons' && gameBase('submachine').unlocked == true" class="position-fixed top-0 bottom-0 start-0 end-0" style="margin-top:105px; margin-bottom:50px;">
                <div class="container py-3 scrollbar">
                    <div class="row gx-4 scrollbar">
                        <div class="col-auto scrollbar" style="width:425px;">
                            <div class="row g-3">
                                <div class="col-12">
                                    <div class="row g-3">
                                        <ButtonAlienEgg :item="game.bases['alienEgg']" @click="setCurrentWeaponsPageId('alienEgg')" :active="currentWeaponsPageId == 'alienEgg'" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <PageAlienEgg v-if="currentWeaponsPageId == 'alienEgg'" :item="game.bases['alienEgg']" />
                        
                    </div>
                </div>
            </div>            

            <div v-if="currentTabId == 'trophies'" class="position-fixed top-0 bottom-0 start-0 end-0" style="margin-top:105px; margin-bottom:50px;">
                <div class="container py-3 scrollbar">
                    <div class="row g-3">
                        <div class="col-12">
                            <div class="h-100 card">
                                <div class="card-header">
                                    <span>Easy Mode</span>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-6">
                                            <div class="subtitle">Statistics</div>
                                            <table class="table">
                                                <tbody>
                                                    <tr>
                                                        <td>Fastest Win Time</td>
                                                        <td nowrap class="text-end"><FormatTime :value="game.stats.easyMode.winTime" /></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total Time Played</td>
                                                        <td nowrap class="text-end"><FormatTime :value="game.stats.easyMode.totalTimePlayed" /></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total Alien Eggs Earned</td>
                                                        <td nowrap class="text-end"><FormatNumber :value="game.stats.easyMode.totalAlienEggs" /></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total Alien Nest Killed</td>
                                                        <td nowrap class="text-end"><FormatNumber :value="game.stats.easyMode.totalAlienNests" /></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="col-6">
                                            <div class="subtitle">Achievements</div>
                                            <table class="table">
                                                <tbody>
                                                    <tr>
                                                        <td>Escape the planet</td>
                                                        <td nowrap class="text-end"><i class="fas fa-fw fa-trophy" :class="{ 'text-success':game.trophies.easyMode.win, 'text-muted opacity-25':!game.trophies.easyMode.win }"></i></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Research All Techs</td>
                                                        <td nowrap class="text-end"><i class="fas fa-fw fa-trophy" :class="{ 'text-success':game.trophies.easyMode.allResearches, 'text-muted opacity-25':!game.trophies.easyMode.allResearches }"></i></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="h-100 card">
                                <div class="card-header">
                                    <span>Hardcore Mode</span>
                                </div>
                                <div class="card-body">
                                    <span class="text-primary">Will be implemented soon</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div v-if="currentTabId == 'settings'" class="position-fixed top-0 bottom-0 start-0 end-0" style="margin-top:105px; margin-bottom:50px;">
                <div class="container py-3 scrollbar">
                    <div class="row g-3">
                        <div class="col-12">
                            <div class="h-100 card">
                                <div class="card-header">
                                    <span>About</span>
                                </div>
                                <div class="card-body">
                                    <div class="row g-3">
                                        <div class="col-6">
                                            <div class="row g-3">
                                                <div class="col-12 text-center text-normal">This game has been designed and built with all the love in the world by <span class="text-white">Freddec Games</span>. To be kept informed about other games and the future of this one, join Discord server and visit our official website.</div>
                                                <div class="col-12">
                                                    <div class="row align-items-center justify-content-center">
                                                        <div class="col-auto">
                                                            <a href="https://discord.gg/3UkgeeT9CV" target="_blank" class="btn btn-primary">
                                                                <img :src="require(`~/assets/ui/discord.png`)" width="16px" height="16px" alt="Discord" />
                                                                <span class="ms-2">Discord</span>
                                                            </a>
                                                        </div>
                                                        <div class="col-auto">
                                                            <a href="https://freddecgames.com/" target="_blank" class="btn btn-primary">
                                                                <img :src="require(`~/assets/ui/freddec.png`)" width="16px" height="16px" alt="Freddec Games" />
                                                                <span class="ms-2">Freddec Games</span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-12">
                                                    <div class="alert alert-danger text-center">
                                                        <div class="fw-bold">Alpha Version</div>
                                                        <div>This game is still under development with bugs and maybe data lost! Play as your own risks!</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <div class="row g-3">
                                                <div class="col-12 text-center text-normal">This game is largely inspired by the game <span class="text-white">Factorio</span> (productions, buildings, recipes, techs and etc ...)</div>
                                                <div class="col-12 text-center d-flex justify-content-center">
                                                    <a href="https://www.factorio.com/" target="_blank" class="btn btn-primary text-center">
                                                        <img :src="require(`~/assets/ui/factorio.png`)" width="16px" height="16px" alt="Factorio" />
                                                        <span class="ms-2">Factorio Offical Site</span>
                                                    </a>
                                                </div>
                                                <div class="col-12 text-center text-normal">Icons are provided by <a href="https://wiki.factorio.com/" target="_blank">Factorio Wiki</a>, <a href="https://www.flaticon.com/" target="_blank">Flaticon</a> and <a href="https://fontawesome.com/" target="_blank">Fontawesome</a></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-sm-12 col-md-6">
                            <div class="h-100 card">
                                <div class="card-header">
                                    <span>Options</span>
                                </div>
                                <div class="card-body">
                                    <div class="row g-2">
                                        <div class="col-12">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" v-model="game.options.researchedTechs" id="options_researchedTechs">
                                                <label class="form-check-label" for="options_researchedTechs">Show researched techs</label>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" v-model="game.options.startStopShortcut" id="options_startStopShortcut">
                                                <label class="form-check-label" for="options_startStopShortcut">Show start/stop shortcut</label>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" v-model="game.options.upgradeStorageShortcut" id="options_upgradeStorageShortcut">
                                                <label class="form-check-label" for="options_upgradeStorageShortcut">Show upgrade storage shortcut</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-sm-12 col-md-6">
                            <div class="h-100 card">
                                <div class="card-header">
                                    <span>Hard Reset</span>
                                </div>
                                <div class="card-body d-flex align-items-center justify-content-center">
                                    <button type="button" class="btn btn-danger align-items-center" @click="showWipeDataPopup()">
                                        <i class="fas fa-fw fa-skull"></i>
                                        <span class="ms-2">Wipe Local Data</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6 col-md-6">
                            <div class="h-100 card">
                                <div class="card-header">
                                    <span>Export Save</span>
                                </div>
                                <div class="card-body">
                                    <textarea spellcheck="false" rows="5" class="w-100 rounded bg-1 border-0 text-normal p-2" disabled readonly>{{ exportGameData }}</textarea>                                        
                                    <div class="mt-1 row gx-2 align-items-center justify-content-end">
                                        <div class="col-auto">
                                            <button type="button" class="btn btn-primary" @click="exportToClipboard()">
                                                <span>Copy to clipboard</span>
                                            </button>
                                        </div>
                                        <div class="col-auto">
                                            <button type="button" class="btn btn-primary" @click="downloadGameData()">
                                                <span>Download TXT file</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6 col-md-6">
                            <div class="h-100 card">
                                <div class="card-header">
                                    <span>Import Save</span>
                                </div>
                                <div class="card-body">
                                    <textarea spellcheck="false" rows="5" class="w-100 rounded bg-1 border-0 text-normal p-2" v-model="importExportData"></textarea>
                                    <div class="mt-1 d-flex justify-content-end">
                                        <button type="button" class="btn btn-primary" @click="importGameData()">
                                            <span>Import</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="position-fixed bottom-0 start-0 end-0 bg-2 d-flex align-items-center" style="height:50px;">
                <div class="container">
                    <div class="row gx-2 align-items-center">
                        <BottomButton label="Save" icon="fa-save" :click="manualSave" />
                        <BottomButton label="Support" icon="fa-hand-holding-heart" :click="showSupportPopup" />
                        <BottomButton label="Tutorial" icon="fa-question-circle" :click="enableTutorial" />
                        <div class="ms-auto col-auto">
                            <div class="text-center text-muted">Time Played</div>
                            <div class="text-center"><FormatTime :value="game.timePlayed" /></div>
                        </div>
                        <BottomButton v-if="game.paused == false" label="Pause" icon="fa-pause" :click="pauseGame" />
                        <BottomButton v-if="game.paused == true" label="Resume" icon="fa-play" :click="resumeGame" :border="true" />
                    </div>
                </div>
            </div>
            
        </div>
                    
    </div>
</template>

<script>

//------------------------------------------------------------------------------

var easyMachines = {

    drill:          { icon:'drill',             name:'drill',           time:4,	    costs:{ ironPlate:9, stone:5 }, },
    furnace:        { icon:'furnace',           name:'furnace',         time:1,	    costs:{ stone:5 }, },
    assembler:      { icon:'assembler',         name:'assembler',       time:7,	    costs:{ copperPlate:5, ironPlate:22 }, },
    offshorePump:   { icon:'offshorePump',      name:'offshorePump',    time:4,	    costs:{ copperPlate:3, ironPlate:5 }, },
    pumpjack:       { icon:'pumpjack',          name:'pumpjack',        time:21,    costs:{ copperPlate:8, ironPlate:35, steelPlate:5 }, },
    oilRefinery:    { icon:'oilRefinery',       name:'oilRefinery',     time:31,    costs:{ copperPlate:15, ironPlate:40, steelPlate:15, stoneBrick:10 }, },
    chemicalPlant:  { icon:'chemicalPlant',     name:'chemicalPlant',   time:16,    costs:{ copperPlate:8, ironPlate:20, steelPlate:5 }, },
    rocketSilo:     { icon:'rocketSilo',        name:'rocketSilo',      time:80,	costs:{ concrete:1000, electricEngine:200, ironPlate:100, processingUnit:200, steelPlate:1000 }, },
}

var easyData = [

    {	id:'submachine',            type:'weapon', reqs:[ 'military1' ],                                auto:true,      fireTime:.1,    time:15,	    costs:{ ironPlate:30, copperPlate:5 }, },
    {	id:'combatShotgun',         type:'weapon', reqs:[ 'military3' ],                                auto:true,      fireTime:.5,    time:13,	    costs:{ ironPlate:10, copperPlate:10, steelPlate:15 }, },
    {	id:'rocketLauncher',        type:'weapon', reqs:[ 'rocketry1' ],                                auto:true,      fireTime:1,     time:19,	    costs:{ ironPlate:20, copperPlate:8 }, },
    {	id:'artilleryTurret',       type:'weapon', reqs:[ 'military4' ],                                auto:true,      fireTime:4,     time:250,	    costs:{ concrete:60, copperPlate:100, ironPlate:120, plasticBar:40, steelPlate:60 }, },

    {   id:'bullet',                type:'ammunition', reqs:[ 'military1' ],                            weaponIds:[ 'submachine' ],         desc:true,  damages:{ physical:5 },                     productionLevel:1,    time:1,	    output:10,  inputs:{ ironPlate:4 }, },
    {   id:'bulletPiercing',        type:'ammunition', reqs:[ 'military2' ],                            weaponIds:[ 'submachine' ],         desc:true,  damages:{ physical:8 },                     productionLevel:1,    time:4,	    output:10,  inputs:{ copperPlate:5, ironPlate:4, steelPlate:1 }, },
    {   id:'shotgunShell',          type:'ammunition', reqs:[ 'military1' ],                            weaponIds:[ 'combatShotgun' ],      desc:true,  damages:{ physical:60 },                    productionLevel:1,    time:3,       output:2,   inputs:{ copperPlate:2, ironPlate:2 }, },
    {   id:'piercingShell',         type:'ammunition', reqs:[ 'military4' ],                            weaponIds:[ 'combatShotgun' ],      desc:true,  damages:{ physical:128 },                   productionLevel:1,    time:14,      output:1,   inputs:{ copperPlate:9, ironPlate:4, steelPlate:2 }, },
    {   id:'rocket',                type:'ammunition', reqs:[ 'rocketry1' ],                            weaponIds:[ 'rocketLauncher' ],     desc:true,  damages:{ explosion:200 },                  productionLevel:1,    time:9,       output:1,   inputs:{ copperPlate:2, explosive:1, ironPlate:3 }, },
    {   id:'explosiveRocket',       type:'ammunition', reqs:[ 'rocketry2' ],                            weaponIds:[ 'rocketLauncher' ],     desc:true,  damages:{ explosion:650 },                  productionLevel:1,    time:17,      output:1,   inputs:{ copperPlate:2, explosive:3, ironPlate:3 }, },
    {   id:'artilleryShell',        type:'ammunition', reqs:[ 'military4' ],                            weaponIds:[ 'artilleryTurret' ],    desc:true,  damages:{ physical:500, explosion:500 },    productionLevel:1,    time:56,      output:1,   inputs:{ copperPlate:8, explosive:16, ironPlate:25, plasticBar:8, steelPlate:8 }, },
    
    {	id:'coal',                  type:'item', reqs:[ 'explosives' ],                                 productionLevel:1,    time:4,	    output:1,   },
    {	id:'iron',                  type:'item',                                                        productionLevel:1,    time:4,	    output:1,   },
    {	id:'ironPlate',             type:'item',                                                        productionLevel:0,    time:3,	    output:1,   inputs:{ iron:1 }, },
    {	id:'steelPlate',            type:'item', reqs:[ 'steelTech' ],                                  productionLevel:0,    time:16,	    output:1,   inputs:{ ironPlate:5 }, },
    {	id:'engine',                type:'item', reqs:[ 'engineTech' ],                                 productionLevel:0,    time:12,	    output:1,   inputs:{ ironPlate:4, steelPlate:1 }, },
    {	id:'electricEngine',        type:'item', reqs:[ 'electricEngineTech' ],                         productionLevel:0,    time:13,	    output:1,   inputs:{ copperPlate:3, engine:1, ironPlate:2, lubricant:15 }, },
    {	id:'stone',                 type:'item',                                                        productionLevel:1,    time:4,	    output:1,   },
    {	id:'stoneBrick',            type:'item', reqs:[ 'automation1' ],                                productionLevel:0,    time:3,	    output:1,   inputs:{ stone:2 }, },
    {	id:'concrete',              type:'item', reqs:[ 'concreteTech' ],                               productionLevel:0,    time:10,	    output:10,  inputs:{ iron:1, stoneBrick:5, water:100 }, },
    {	id:'copper',                type:'item',                                                        productionLevel:1,    time:4,	    output:1,   },
    {	id:'copperPlate',           type:'item',                                                        productionLevel:0,    time:3,       output:1,   inputs:{ copper:1 }, },
    {	id:'processingUnit',        type:'item', reqs:[ 'electronics' ],                                productionLevel:0,    time:54,      output:1,   inputs:{ copperPlate:40, ironPlate:24, plasticBar:4, sulfuricAcid:5 }, },
    {	id:'water',                 type:'item', reqs:[ 'fluidHandling' ],                              productionLevel:0,    time:1,	    output:12,  },
    {	id:'oil',                   type:'item', reqs:[ 'oilTech1' ],                                   productionLevel:0,    time:1,	    output:12,  },
    {	id:'heavyOil',              type:'item', reqs:[ 'oilTech1' ],                                   productionLevel:0,    time:5,	    output:25,  inputs:{ oil:100, water:50 }, },
    {	id:'lubricant',             type:'item', reqs:[ 'lubricantTech' ],                              productionLevel:0,    time:1,	    output:10,  inputs:{ heavyOil:10 }, },
    {	id:'lightOil',              type:'item', reqs:[ 'oilTech1' ],                                   productionLevel:0,    time:2,	    output:30,  inputs:{ heavyOil:40, water:30 }, },
    {	id:'petroleumGas',          type:'item', reqs:[ 'oilTech1' ],                                   productionLevel:0,    time:5,	    output:45,  inputs:{ oil:100 }, },
    {	id:'plasticBar',            type:'item', reqs:[ 'plastics' ],                                   productionLevel:0,    time:1,	    output:2,   inputs:{ petroleumGas:20 }, },
    {	id:'solidFuel',             type:'item', reqs:[ 'oilTech2' ],                                   productionLevel:0,    time:2,	    output:1,   inputs:{ petroleumGas:20 }, },
    {	id:'sulfur',                type:'item', reqs:[ 'sulfurTech' ],                                 productionLevel:0,    time:2,	    output:2,   inputs:{ petroleumGas:30, water:30 }, },
    {	id:'sulfuricAcid',          type:'item', reqs:[ 'sulfurTech' ],                                 productionLevel:0,    time:1,	    output:50,  inputs:{ ironPlate:1, sulfur:5, water:100 }, },
    {	id:'battery',               type:'item', reqs:[ 'batteryTech' ],                                productionLevel:0,    time:1,	    output:50,  inputs:{ copperPlate:1, ironPlate:1, sulfuricAcid:20 }, },
    {	id:'explosive',             type:'item', reqs:[ 'sulfurTech', 'explosives' ],                   productionLevel:0,    time:4,	    output:2,   inputs:{ coal:1, sulfur:1, water:10 }, },
    {	id:'rocketFuel',            type:'item', reqs:[ 'rocketFuelTech' ],                             productionLevel:0,    time:30,	    output:1,   inputs:{ lightOil:10, solidFuel:10 }, },
    {	id:'rocketPart',            type:'item', reqs:[ 'rocketTech' ],                                 productionLevel:0,    time:1200,	output:1,   inputs:{ copperPlate:525, ironPlate:150, plasticBar:150, processingUnit:10, rocketFuel:10, steelPlate:20 }, },

    {	id:'redPack',               type:'item',                                                        productionLevel:1,    time:6,	    output:1,   inputs:{ ironPlate:2, copperPlate:1 }, },
    {	id:'greenPack',             type:'item', reqs:[ 'greenScience' ],                               productionLevel:1,    time:9,	    output:1,   inputs:{ ironPlate:6, copperPlate:2 }, },
    {	id:'bluePack',              type:'item', reqs:[ 'blueScience' ],                                productionLevel:1,    time:53,	    output:2,   inputs:{ ironPlate:6, copperPlate:15, engine:2, plasticBar:6, sulfur:1 }, },
    {	id:'purplePack',            type:'item', reqs:[ 'purpleScience' ],                              productionLevel:1,    time:154,	    output:3,   inputs:{ ironPlate:33, copperPlate:58, steelPlate:25, plasticBar:20, stone:15, stoneBrick:10, alienEgg:1 }, },
    {	id:'yellowPack',            type:'item', reqs:[ 'yellowScience' ],                              productionLevel:1,    time:105,	    output:3,   inputs:{ ironPlate:3, copperPlate:65, steelPlate:7, plasticBar:15, battery:2, processingUnit:2, electricEngine:1 }, },
    {	id:'grayPack',              type:'item', reqs:[ 'grayScience' ],                                productionLevel:1,    time:23,	    output:2,   inputs:{ coal:10, ironPlate:9, copperPlate:5, steelPlate:1, stoneBrick:10 }, },
    
    {	id:'alienEgg',              type:'base', reqs:[ 'military1' ],                                  productionLevel:0,    },
    
    {   id:'biter1',                type:'alien', reqs:[ 'military1' ],                                 genCount:150,   health:15,      shield:{ physical:0,  explosion:0  },  armor:{ physical:0,   explosion:0   }, eggCoeff:.7,  },
    {   id:'biter2',                type:'alien', reqs:[ 'military1' ],                                 genCount:100,   health:75,      shield:{ physical:4,  explosion:0  },  armor:{ physical:.1,  explosion:.1  }, eggCoeff:.6,  },
    {   id:'biter3',                type:'alien', reqs:[ 'military1' ],                                 genCount:50,    health:375,     shield:{ physical:8,  explosion:0  },  armor:{ physical:.1,  explosion:.1  }, eggCoeff:.5,  },
    {   id:'biter4',                type:'alien', reqs:[ 'military2' ],                                 genCount:30,    health:3000,    shield:{ physical:12, explosion:12 },  armor:{ physical:.1,  explosion:.1  }, eggCoeff:.4,  },
    {   id:'nest',                  type:'alien', reqs:[ 'military3' ],                                 genCount:1,     health:30000,   shield:{ physical:2,  explosion:5  },  armor:{ physical:.15, explosion:.15 }, eggCoeff:1.1, },

    {   id:'lab',                   type:'lab',                                                         icon:'lab',                 name:'lab',             time:22,        costs:{ copperPlate:15, ironPlate:36 }, },

    {	id:'bulletT1',              type:'building', reqs:[ 'military1', 'automation1' ],               baseId:'bullet',            machine:easyMachines.assembler, },
    {	id:'bulletPiercingT1',      type:'building', reqs:[ 'military2', 'automation1' ],               baseId:'bulletPiercing',    machine:easyMachines.assembler, },
    {	id:'shotgunShellT1',        type:'building', reqs:[ 'military1', 'automation1' ],               baseId:'shotgunShell',      machine:easyMachines.assembler, },
    {	id:'piercingShellT1',       type:'building', reqs:[ 'military4', 'automation1' ],               baseId:'piercingShell',     machine:easyMachines.assembler, },
    {	id:'rocketT1',              type:'building', reqs:[ 'rocketry1', 'automation1' ],               baseId:'rocket',            machine:easyMachines.assembler, },
    {	id:'explosiveRocketT1',     type:'building', reqs:[ 'rocketry2', 'automation1' ],               baseId:'explosiveRocket',   machine:easyMachines.assembler, },
    {	id:'artilleryShellT1',      type:'building', reqs:[ 'military4', 'automation1' ],               baseId:'artilleryShell',    machine:easyMachines.assembler, },
    
    {	id:'coalT1',                type:'building', reqs:[ 'explosives' ],                             baseId:'coal',              machine:easyMachines.drill, },
    {	id:'ironT1',                type:'building',                                                    baseId:'iron',              machine:easyMachines.drill, },
    {	id:'ironPlateT1',           type:'building',                                                    baseId:'ironPlate',         machine:easyMachines.furnace, },
    {	id:'steelPlateT1',          type:'building', reqs:[ 'steelTech' ],                              baseId:'steelPlate',        machine:easyMachines.furnace, },
    {	id:'engineT1',              type:'building', reqs:[ 'engineTech', 'automation1' ],              baseId:'engine',            machine:easyMachines.assembler, },
    {	id:'electricEngineT1',      type:'building', reqs:[ 'electricEngineTech', 'automation1' ],      baseId:'electricEngine',    machine:easyMachines.assembler, },
    {	id:'stoneT1',               type:'building',                                                    baseId:'stone',             machine:easyMachines.drill, },
    {	id:'stoneBrickT1',          type:'building', reqs:[ 'automation1' ],                            baseId:'stoneBrick',        machine:easyMachines.furnace, },
    {	id:'concreteT1',            type:'building', reqs:[ 'concreteTech', 'automation1' ],            baseId:'concrete',          machine:easyMachines.assembler, },
    {	id:'copperT1',              type:'building',                                                    baseId:'copper',            machine:easyMachines.drill, },
    {	id:'copperPlateT1',         type:'building',                                                    baseId:'copperPlate',       machine:easyMachines.furnace, },
    {	id:'processingUnitT1',      type:'building', reqs:[ 'electronics', 'automation1' ],             baseId:'processingUnit',    machine:easyMachines.assembler, },
    {	id:'waterT1',               type:'building', reqs:[ 'fluidHandling' ],                          baseId:'water',             machine:easyMachines.offshorePump, },
    {	id:'oilT1',                 type:'building', reqs:[ 'oilTech1' ],                               baseId:'oil',               machine:easyMachines.pumpjack, },
    {	id:'heavyOilT1',            type:'building', reqs:[ 'oilTech1' ],                               baseId:'heavyOil',          machine:easyMachines.oilRefinery, },
    {	id:'lubricantT1',           type:'building', reqs:[ 'lubricantTech' ],                          baseId:'lubricant',         machine:easyMachines.chemicalPlant, },
    {	id:'lightOilT1',            type:'building', reqs:[ 'oilTech1' ],                               baseId:'lightOil',          machine:easyMachines.chemicalPlant, },
    {	id:'petroleumGasT1',        type:'building', reqs:[ 'oilTech1' ],                               baseId:'petroleumGas',      machine:easyMachines.oilRefinery, },
    {	id:'plasticBarT1',          type:'building', reqs:[ 'plastics', 'oilTech1' ],                   baseId:'plasticBar',        machine:easyMachines.chemicalPlant, },
    {	id:'solidFuelT1',           type:'building', reqs:[ 'oilTech2', 'oilTech1' ],                   baseId:'solidFuel',         machine:easyMachines.chemicalPlant, },
    {	id:'sulfurT1',              type:'building', reqs:[ 'sulfurTech', 'oilTech1' ],                 baseId:'sulfur',            machine:easyMachines.chemicalPlant, },
    {	id:'sulfuricAcidT1',        type:'building', reqs:[ 'sulfurTech', 'oilTech1' ],                 baseId:'sulfuricAcid',      machine:easyMachines.chemicalPlant, },
    {	id:'batteryT1',             type:'building', reqs:[ 'batteryTech' ],                            baseId:'battery',           machine:easyMachines.chemicalPlant, },
    {	id:'explosiveT1',           type:'building', reqs:[ 'sulfurTech', 'explosives' ],               baseId:'explosive',         machine:easyMachines.chemicalPlant, },
    {	id:'rocketFuelT1',          type:'building', reqs:[ 'rocketFuelTech', 'automation1' ],          baseId:'rocketFuel',        machine:easyMachines.assembler, },
    {	id:'rocketPartT1',          type:'building', reqs:[ 'rocketTech' ],                             baseId:'rocketPart',        machine:easyMachines.rocketSilo, },
    
    {	id:'redPackT1',             type:'building', reqs:[ 'automation1' ],                            baseId:'redPack',           machine:easyMachines.assembler, },
    {	id:'greenPackT1',           type:'building', reqs:[ 'greenScience', 'automation1' ],            baseId:'greenPack',         machine:easyMachines.assembler, },
    {	id:'bluePackT1',            type:'building', reqs:[ 'blueScience', 'automation1' ],             baseId:'bluePack',          machine:easyMachines.assembler, },
    {	id:'purplePackT1',          type:'building', reqs:[ 'purpleScience', 'automation1' ],           baseId:'purplePack',        machine:easyMachines.assembler, },
    {	id:'yellowPackT1',          type:'building', reqs:[ 'yellowScience', 'automation1' ],           baseId:'yellowPack',        machine:easyMachines.assembler, },
    {	id:'grayPackT1',            type:'building', reqs:[ 'grayScience', 'automation1' ],             baseId:'grayPack',          machine:easyMachines.assembler, },

    {	id:'bulletS1',              type:'storage', reqs:[ 'military1', 'automation1' ],                icon:'chest',               name:'chest',           baseId:'bullet',            storage:50,    time:10,    costs:{ bullet:50 }, },
    {	id:'bulletPiercingS1',      type:'storage', reqs:[ 'military2', 'automation1' ],                icon:'chest',               name:'chest',           baseId:'bulletPiercing',    storage:50,    time:10,    costs:{ bulletPiercing:50 }, },
    {	id:'shotgunShellS1',        type:'storage', reqs:[ 'military1', 'automation1' ],                icon:'chest',               name:'chest',           baseId:'shotgunShell',      storage:50,    time:10,    costs:{ shotgunShell:50 }, },
    {	id:'piercingShellS1',       type:'storage', reqs:[ 'military4', 'automation1' ],                icon:'chest',               name:'chest',           baseId:'piercingShell',     storage:50,    time:10,    costs:{ piercingShell:50 }, },
    {	id:'rocketS1',              type:'storage', reqs:[ 'rocketry1', 'automation1' ],                icon:'chest',               name:'chest',           baseId:'rocket',            storage:50,    time:10,    costs:{ rocket:50 }, },
    {	id:'explosiveRocketS1',     type:'storage', reqs:[ 'rocketry2', 'automation1' ],                icon:'chest',               name:'chest',           baseId:'explosiveRocket',   storage:50,    time:10,    costs:{ explosiveRocket:50 }, },
    {	id:'artilleryShellS1',      type:'storage', reqs:[ 'military4', 'automation1' ],                icon:'chest',               name:'chest',           baseId:'artilleryShell',    storage:50,    time:10,    costs:{ artilleryShell:50 }, },

    {	id:'coalS1',                type:'storage', reqs:[ 'explosives', 'automation1' ],               icon:'chest',               name:'chest',           baseId:'coal',              storage:50,    time:10,    costs:{ coal:50 }, },
    {	id:'ironS1',                type:'storage', reqs:[ 'automation1' ],                             icon:'chest',               name:'chest',           baseId:'iron',              storage:50,    time:10,    costs:{ iron:50 }, },
    {	id:'ironPlateS1',           type:'storage', reqs:[ 'automation1' ],                             icon:'chest',               name:'chest',           baseId:'ironPlate',         storage:50,    time:10,    costs:{ ironPlate:50 }, },
    {	id:'steelPlateS1',          type:'storage', reqs:[ 'steelTech', 'automation1' ],                icon:'chest',               name:'chest',           baseId:'steelPlate',        storage:50,    time:10,    costs:{ steelPlate:50 }, },
    {	id:'engineS1',              type:'storage', reqs:[ 'engineTech', 'automation1' ],               icon:'chest',               name:'chest',           baseId:'engine',            storage:50,    time:10,    costs:{ engine:50 }, },
    {	id:'electricEngineS1',      type:'storage', reqs:[ 'electricEngineTech', 'automation1' ],       icon:'chest',               name:'chest',           baseId:'electricEngine',    storage:50,    time:10,    costs:{ electricEngine:50 }, },
    {	id:'stoneS1',               type:'storage', reqs:[ 'automation1' ],                             icon:'chest',               name:'chest',           baseId:'stone',             storage:50,    time:10,    costs:{ stone:50 }, },
    {	id:'stoneBrickS1',          type:'storage', reqs:[ 'automation1' ],                             icon:'chest',               name:'chest',           baseId:'stoneBrick',        storage:50,    time:10,    costs:{ stoneBrick:50 }, },
    {	id:'concreteS1',            type:'storage', reqs:[ 'concreteTech', 'automation1' ],             icon:'chest',               name:'chest',           baseId:'concrete',          storage:50,    time:10,    costs:{ concrete:50 }, },
    {	id:'copperS1',              type:'storage', reqs:[ 'automation1' ],                             icon:'chest',               name:'chest',           baseId:'copper',            storage:50,    time:10,    costs:{ copper:50 }, },
    {	id:'copperPlateS1',         type:'storage', reqs:[ 'automation1' ],                             icon:'chest',               name:'chest',           baseId:'copperPlate',       storage:50,    time:10,    costs:{ copperPlate:50 }, },
    {	id:'processingUnitS1',      type:'storage', reqs:[ 'electronics', 'automation1' ],              icon:'chest',               name:'chest',           baseId:'processingUnit',    storage:50,    time:10,    costs:{ processingUnit:50 }, },
    {	id:'waterS1',               type:'storage', reqs:[ 'fluidHandling' ],                           icon:'barrel',              name:'barrel',          baseId:'water',             storage:50,    time:10,    costs:{ water:50 }, },
    {	id:'oilS1',                 type:'storage', reqs:[ 'oilTech1', 'fluidHandling' ],               icon:'barrel',              name:'barrel',          baseId:'oil',               storage:50,    time:10,    costs:{ oil:50 }, },
    {	id:'heavyOilS1',            type:'storage', reqs:[ 'oilTech1', 'fluidHandling' ],               icon:'barrel',              name:'barrel',          baseId:'heavyOil',          storage:50,    time:10,    costs:{ heavyOil:50 }, },
    {	id:'lubricantS1',           type:'storage', reqs:[ 'lubricantTech', 'fluidHandling' ],          icon:'barrel',              name:'barrel',          baseId:'lubricant',         storage:50,    time:10,    costs:{ lubricant:50 }, },
    {	id:'lightOilS1',            type:'storage', reqs:[ 'oilTech1', 'fluidHandling' ],               icon:'barrel',              name:'barrel',          baseId:'lightOil',          storage:50,    time:10,    costs:{ lightOil:50 }, },
    {	id:'petroleumGasS1',        type:'storage', reqs:[ 'oilTech1', 'fluidHandling' ],               icon:'barrel',              name:'barrel',          baseId:'petroleumGas',      storage:50,    time:10,    costs:{ petroleumGas:50 }, },
    {	id:'plasticBarS1',          type:'storage', reqs:[ 'plastics', 'automation1' ],                 icon:'chest',               name:'chest',           baseId:'plasticBar',        storage:50,    time:10,    costs:{ plasticBar:50 }, },
    {	id:'solidFuelS1',           type:'storage', reqs:[ 'oilTech2', 'automation1' ],                 icon:'chest',               name:'chest',           baseId:'solidFuel',         storage:50,    time:10,    costs:{ solidFuel:50 }, },
    {	id:'sulfurS1',              type:'storage', reqs:[ 'sulfurTech', 'oilTech1', 'automation1' ],   icon:'chest',               name:'chest',           baseId:'sulfur',            storage:50,    time:10,    costs:{ sulfur:50 }, },
    {	id:'sulfuricAcidS1',        type:'storage', reqs:[ 'sulfurTech', 'oilTech1', 'fluidHandling' ], icon:'barrel',              name:'barrel',          baseId:'sulfuricAcid',      storage:50,    time:10,    costs:{ sulfuricAcid:50 }, },
    {	id:'batteryS1',             type:'storage', reqs:[ 'batteryTech', 'automation1' ],              icon:'chest',               name:'chest',           baseId:'battery',           storage:50,    time:10,    costs:{ battery:50 }, },
    {	id:'explosiveS1',           type:'storage', reqs:[ 'sulfurTech', 'explosives', 'automation1' ], icon:'chest',               name:'chest',           baseId:'explosive',         storage:50,    time:10,    costs:{ explosive:50 }, },
    {	id:'rocketFuelS1',          type:'storage', reqs:[ 'rocketFuelTech', 'automation1' ],           icon:'chest',               name:'chest',           baseId:'rocketFuel',        storage:50,    time:10,    costs:{ rocketFuel:50 }, },
    {	id:'rocketPartS1',          type:'storage', reqs:[ 'automation1' ],                             icon:'chest',               name:'chest',           baseId:'rocketPart',        storage:50,    time:10,    costs:{ rocketPart:50 }, },

    {	id:'redPackS1',             type:'storage', reqs:[ 'automation1' ],                             icon:'chest',               name:'chest',           baseId:'redPack',           storage:50,    time:10,    costs:{ redPack:50 }, },
    {	id:'greenPackS1',           type:'storage', reqs:[ 'greenScience', 'automation1' ],             icon:'chest',               name:'chest',           baseId:'greenPack',         storage:50,    time:10,    costs:{ greenPack:50 }, },
    {	id:'bluePackS1',            type:'storage', reqs:[ 'blueScience', 'automation1' ],              icon:'chest',               name:'chest',           baseId:'bluePack',          storage:50,    time:10,    costs:{ bluePack:50 }, },
    {	id:'purplePackS1',          type:'storage', reqs:[ 'purpleScience', 'automation1' ],            icon:'chest',               name:'chest',           baseId:'purplePack',        storage:50,    time:10,    costs:{ purplePack:50 }, },
    {	id:'yellowPackS1',          type:'storage', reqs:[ 'yellowScience', 'automation1' ],            icon:'chest',               name:'chest',           baseId:'yellowPack',        storage:50,    time:10,    costs:{ yellowPack:50 }, },
    {	id:'grayPackS1',            type:'storage', reqs:[ 'grayScience', 'automation1' ],              icon:'chest',               name:'chest',           baseId:'grayPack',          storage:50,    time:10,    costs:{ grayPack:50 }, },

    {	id:'rocketTech',            type:'tech', reqs:[ 'rocketFuelTech' ],                             time:60000,     costs:{ redPack:1000, greenPack:1000, bluePack:1000, purplePack:1000, yellowPack:1000 }, },
    {	id:'military4',             type:'tech', reqs:[ 'military3' ],                                  time:6750,      costs:{ redPack:150, greenPack:150, bluePack:150, grayPack:150, yellowPack:150 }, },
    {	id:'rocketFuelTech',        type:'tech', reqs:[ 'oilTech2' ],                                   time:13500,     costs:{ redPack:300, greenPack:300, bluePack:300 }, },
    {	id:'electronics',           type:'tech', reqs:[ 'oilTech2' ],                                   time:9000,      costs:{ redPack:300, greenPack:300, bluePack:300 }, },
    {	id:'yellowScience',         type:'tech', reqs:[ 'electronics' ],                                time:3000,      costs:{ redPack:100, greenPack:100, bluePack:100 }, },
    {	id:'purpleScience',         type:'tech', reqs:[ 'oilTech2' ],                                   time:3000,      costs:{ redPack:100, greenPack:100, bluePack:100 }, },
    {	id:'rocketry2',             type:'tech', reqs:[ 'rocketry1', 'military3' ],                     time:3000,      costs:{ redPack:100, greenPack:100, bluePack:100, grayPack:100 }, },
    {	id:'military3',             type:'tech', reqs:[ 'military2' ],                                  time:3000,      costs:{ redPack:100, greenPack:100, bluePack:100, grayPack:100 }, },
    {	id:'rocketry1',             type:'tech', reqs:[ 'grayScience' ],                                time:1800,      costs:{ redPack:120, greenPack:120, grayPack:120 }, },
    {	id:'oilTech2',              type:'tech', reqs:[ 'blueScience' ],                                time:2250,      costs:{ redPack:75, greenPack:75, bluePack:75 }, },
    {	id:'electricEngineTech',    type:'tech', reqs:[ 'lubricantTech' ],                              time:3000,      costs:{ redPack:50, greenPack:50, bluePack:50 }, },
    {	id:'lubricantTech',         type:'tech', reqs:[ 'oilTech2' ],                                   time:3000,      costs:{ redPack:50, greenPack:50, bluePack:50 }, },
    {	id:'concreteTech',          type:'tech', reqs:[ 'automation2' ],                                time:7500,      costs:{ redPack:250, greenPack:250 }, },
    {	id:'plastics',              type:'tech', reqs:[ 'oilTech1' ],                                   time:6000,      costs:{ redPack:200, greenPack:200 }, },
    {	id:'batteryTech',           type:'tech', reqs:[ 'sulfurTech' ],                                 time:4500,      costs:{ redPack:150, greenPack:150 }, },
    {	id:'sulfurTech',            type:'tech', reqs:[ 'oilTech1' ],                                   time:4500,      costs:{ redPack:150, greenPack:150 }, },
    {	id:'oilTech1',              type:'tech', reqs:[ 'fluidHandling' ],                              time:3000,      costs:{ redPack:100, greenPack:100 }, },
    {	id:'explosives',            type:'tech', reqs:[ 'sulfurTech' ],                                 time:1500,      costs:{ redPack:100, greenPack:100 }, },
    {	id:'engineTech',            type:'tech', reqs:[ 'steelTech' ],                                  time:1500,      costs:{ redPack:100, greenPack:100 }, },
    {	id:'blueScience',           type:'tech', reqs:[ 'sulfurTech' ],                                 time:750,       costs:{ redPack:75, greenPack:75 }, },
    {	id:'fluidHandling',         type:'tech', reqs:[ 'engineTech' ],                                 time:750,       costs:{ redPack:50, greenPack:50 }, },
    {	id:'automation2',           type:'tech', reqs:[ 'greenScience' ],                               time:600,       costs:{ redPack:40, greenPack:40 }, },
    {	id:'grayScience',           type:'tech', reqs:[ 'explosives' ],                                 time:450,	    costs:{ redPack:30, greenPack:30 }, },
    {	id:'military2',             type:'tech', reqs:[ 'military1' ],                                  time:300,	    costs:{ redPack:20, greenPack:20 }, },
    {	id:'greenScience',          type:'tech', reqs:[ 'automation1' ],                                time:375,       costs:{ redPack:75 }, },
    {	id:'steelTech',             type:'tech', reqs:[ 'automation1' ],                                time:250,       costs:{ redPack:50 }, },
    {	id:'military1',             type:'tech', reqs:[ 'automation1' ],                                time:150,	    costs:{ redPack:10 }, },
    {	id:'automation1',           type:'tech',                                                        time:100,	    costs:{ redPack:10 }, },

    {   id:'tut0',                  type:'tutorial',                                                    check: function() { return false },                                                                                 action: function(app) { app.setCurrentTabId('production');    app.setCurrentProductionPageId('iron'); }, },
    {   id:'tut1',                  type:'tutorial',                                                    check: function() { return this.game.bases['iron'].count >= 5 },                                                    action: function(app) { app.setCurrentTabId('production');    app.setCurrentProductionPageId('iron'); }, },
    {   id:'tut2',                  type:'tutorial',                                                    check: function() { return this.game.bases['stone'].count >= 5 },                                                   action: function(app) { app.setCurrentTabId('production');    app.setCurrentProductionPageId('stone'); }, },
    {   id:'tut3',                  type:'tutorial',                                                    check: function() { return this.game.bases['ironPlateT1'].count >= 1 },                                             action: function(app) { app.setCurrentTabId('production');    app.setCurrentProductionPageId('ironPlate'); }, },
    {   id:'tut4',                  type:'tutorial',                                                    check: function() { return this.game.bases['ironT1'].count >= 1 },                                                  action: function(app) { app.setCurrentTabId('production');    app.setCurrentProductionPageId('iron'); }, },
    {   id:'tut5',                  type:'tutorial',                                                    check: function() { return this.game.bases['stoneT1'].count >= 1 },                                                 action: function(app) { app.setCurrentTabId('production');    app.setCurrentProductionPageId('stone'); }, },
    {   id:'tut6',                  type:'tutorial',                                                    check: function() { return this.game.bases['copperPlateT1'].count >= 1 && this.game.bases['copperT1'].count >= 1},  action: function(app) { app.setCurrentTabId('production');    app.setCurrentProductionPageId('copper'); }, },
    {   id:'tut7',                  type:'tutorial',                                                    check: function() { return this.game.lab.count >= 1 },                                                              action: function(app) { app.setCurrentTabId('techs');         app.setCurrentTechPageId('lab'); }, },
    {   id:'tut8',                  type:'tutorial',                                                    check: function() { return this.game.bases['automation1'].count >= 1 },                                             action: function(app) { app.setCurrentTabId('techs');         app.setCurrentTechPageId('lab'); }, },
    {   id:'tut9',                  type:'tutorial',                                                    check: function() { return this.game.bases['military1'].count >= 1 },                                               action: function(app) { app.setCurrentTabId('techs');         app.setCurrentTechPageId('lab'); }, },
    {   id:'tut10',                 type:'tutorial',                                                    check: function() { return this.game.bases['alienEgg'].count >= 1 },                                                action: function(app) { app.setCurrentTabId('weapons');       app.setCurrentWeaponsPageId('alienEgg'); }, },
    {   id:'tut11',                 type:'tutorial',                                                    check: function() { return false },                                                                                 action: function(app) { app.setCurrentTabId('techs');         app.setCurrentTechPageId('lab'); }, },
]

//------------------------------------------------------------------------------

var hardcoreMachines = {

    drill1:         { icon:'drill1',            name:'drill1',          time:5,	    costs:{ ironGearWheel:6, ironPlate:6, stone:10 }, },
    drill2:         { icon:'drill2',            name:'drill2',          time:2,	    costs:{ electronicCircuit:5, ironGearWheel:10, ironPlate:20 }, },
    furnace:        { icon:'furnace',           name:'furnace',         time:1,	    costs:{ stone:5 }, },
    boiler:         { icon:'boiler',            name:'boiler',          time:1,	    costs:{ pipe:4, stone:5 }, },
    steamEngine:    { icon:'steamEngine',       name:'steamEngine',     time:1,	    costs:{ ironGearWheel:10, ironPlate:50, pipe:5 }, },
    assembler1:     { icon:'assembler1',        name:'assembler1',      time:1,	    costs:{ electronicCircuit:3, ironGearWheel:5, ironPlate:9 }, },
    assembler2:     { icon:'assembler2',        name:'assembler2',      time:2,	    costs:{ electronicCircuit:6, ironGearWheel:10, ironPlate:9, steelPlate:2 }, },
    offshorePump:   { icon:'offshorePump',      name:'offshorePump',    time:1,	    costs:{ electronicCircuit:2, ironGearWheel:1, pipe:1 }, },
    pumpjack:       { icon:'pumpjack',          name:'pumpjack',        time:5,     costs:{ electronicCircuit:5, ironGearWheel:10, pipe:10, steelPlate:5 }, },
    oilRefinery:    { icon:'oilRefinery',       name:'oilRefinery',     time:8,     costs:{ electronicCircuit:10, ironGearWheel:10, pipe:10, steelPlate:15, stoneBrick:10 }, },
    chemicalPlant:  { icon:'chemicalPlant',     name:'chemicalPlant',   time:16,    costs:{ electronicCircuit:5, ironGearWheel:5, pipe:5, steelPlate:5 }, },
    centrifuge:     { icon:'centrifuge',        name:'centrifuge',      time:4,     costs:{ advancedCircuit:100, concrete:100, ironGearWheel:100, steelPlate:50 }, },
    rocketSilo:     { icon:'rocketSilo',        name:'rocketSilo',      time:30,	costs:{ concrete:1000, electricEngine:200, pipe:100, processingUnit:200, steelPlate:1000 }, },
}

var hardcoreData = [
    
    {	id:'pistol',                    type:'weapon',      reqs:[ 'military1' ],                                   auto:false,     fireTime:.25,   time:5,	        costs:{ copperPlate:5, ironPlate:5 }, },
    {	id:'submachine',                type:'weapon',      reqs:[ 'military1' ],                                   auto:true,      fireTime:.1,    time:10,	    costs:{ copperPlate:5, ironGearWheel:10, ironPlate:10 }, },
    {	id:'car',                       type:'weapon',      reqs:[ 'automobilism' ],                                auto:true,      fireTime:0.06,  time:2,	        costs:{ engine:8, ironPlate:20, steelPlate:5 }, },
    {	id:'shotgun',                   type:'weapon',      reqs:[ 'military1' ],                                   auto:false,     fireTime:1,     time:10,	    costs:{ copperPlate:10, ironGearWheel:5, ironPlate:15 }, },
    {	id:'combatShotgun',             type:'weapon',      reqs:[ 'military3' ],                                   auto:true,      fireTime:.5,    time:10,	    costs:{ copperPlate:10, ironGearWheel:5, steelPlate:15 }, },
    {	id:'rocketLauncher',            type:'weapon',      reqs:[ 'rocketry1' ],                                   auto:false,     fireTime:1,     time:10,	    costs:{ electronicCircuit:5, ironGearWheel:5, ironPlate:5 }, },
    {	id:'tank',                      type:'weapon',      reqs:[ 'tankTech' ],                                    auto:true,      fireTime:1.5,   time:5,	        costs:{ advancedCircuit:10, engine:32, ironGearWheel:15, steelPlate:50 }, },
    {	id:'artilleryTurret',           type:'weapon',      reqs:[ 'military4' ],                                   auto:true,      fireTime:4,     time:40,	    costs:{ advancedCircuit:20, concrete:60, ironGearWheel:40, steelPlate:60 }, },
    {	id:'spidertron',                type:'weapon',      reqs:[ 'spidertronTech' ],                              auto:true,      fireTime:1,     time:10,	    costs:{ efficiencyModule:2, exoskeleton:4, portableReactor:2, lowDensityStructure:150, radar:2, rocketControlUnit:16, rocketLauncher:4 }, },
    
    {   id:'bullet',                    type:'ammunition',  reqs:[ 'military1' ],                                   weaponIds:[ 'pistol', 'submachine', 'car' ],        desc:true,      damages:{ physical:5 },                     productionLevel:1,    time:1,       output:10,  inputs:{ ironPlate:4 }, },
    {   id:'bulletPiercing',            type:'ammunition',  reqs:[ 'military2' ],                                   weaponIds:[ 'pistol', 'submachine', 'car' ],        desc:true,      damages:{ physical:8 },                     productionLevel:1,    time:4,       output:10,  inputs:{ copperPlate:5, ironPlate:4, steelPlate:1 }, },
    {   id:'bulletUranium',             type:'ammunition',  reqs:[ 'uraniumAmmo' ],                                 weaponIds:[ 'pistol', 'submachine', 'car' ],        desc:true,      damages:{ physical:24 },                    productionLevel:1,    time:14,      output:10,  inputs:{ copperPlate:5, ironPlate:4, steelPlate:1, uranium238:1 }, },
    {   id:'shotgunShell',              type:'ammunition',  reqs:[ 'military1' ],                                   weaponIds:[ 'shotgun', 'combatShotgun' ],           desc:true,      damages:{ physical:60 },                    productionLevel:1,    time:3,       output:2,   inputs:{ copperPlate:2, ironPlate:2 }, },
    {   id:'piercingShell',             type:'ammunition',  reqs:[ 'military4' ],                                   weaponIds:[ 'shotgun', 'combatShotgun' ],           desc:true,      damages:{ physical:128 },                   productionLevel:1,    time:14,      output:1,   inputs:{ copperPlate:9, ironPlate:4, steelPlate:2 }, },
    {   id:'cannonShell',               type:'ammunition',  reqs:[ 'tankTech' ],                                    weaponIds:[ 'tank' ],                               desc:true,      damages:{ physical:200, explosion:100 },    productionLevel:1,    time:8,       output:1,   inputs:{ explosive:1, plasticBar:4, steelPlate:4 }, },
    {   id:'explosiveShell',            type:'ammunition',  reqs:[ 'tankTech' ],                                    weaponIds:[ 'tank' ],                               desc:true,      damages:{ physical:180, explosion:300 },    productionLevel:1,    time:8,       output:1,   inputs:{ explosive:2, plasticBar:4, steelPlate:4 }, },
    {   id:'uraniumShell',              type:'ammunition',  reqs:[ 'uraniumAmmo' ],                                 weaponIds:[ 'tank' ],                               desc:true,      damages:{ physical:400, explosion:200 },    productionLevel:1,    time:12,      output:1,   inputs:{ explosive:1, plasticBar:4, steelPlate:4, uranium238:1 }, },
    {   id:'rocket',                    type:'ammunition',  reqs:[ 'rocketry1' ],                                   weaponIds:[ 'rocketLauncher', 'spidertron' ],       desc:true,      damages:{ explosion:200 },                  productionLevel:1,    time:8,       output:1,   inputs:{ electronicCircuit:1, explosive:1, ironPlate:2 }, },
    {   id:'explosiveRocket',           type:'ammunition',  reqs:[ 'rocketry2' ],                                   weaponIds:[ 'rocketLauncher', 'spidertron' ],       desc:true,      damages:{ explosion:650 },                  productionLevel:1,    time:16,      output:1,   inputs:{ electronicCircuit:1, explosive:3, ironPlate:2 }, },
    {   id:'atomicBomb',                type:'ammunition',  reqs:[ 'rocketry3' ],                                   weaponIds:[ 'rocketLauncher', 'spidertron' ],       desc:true,      damages:{ explosion:4000 },                 productionLevel:1,    time:50,      output:1,   inputs:{ explosive:10, rocketControlUnit:10, uranium235:30 }, },
    {   id:'artilleryShell',            type:'ammunition',  reqs:[ 'military4' ],                                   weaponIds:[ 'artilleryTurret' ],                    desc:true,      damages:{ physical:500, explosion:500 },    productionLevel:1,    time:15,      output:1,   inputs:{ explosive:16, plasticBar:16, steelPlate:16, radar:1 }, },
    
    {	id:'steam',                     type:'item',                                                                productionLevel:0,    time:1,       output:60,  inputs:{ water:60 }, },
    {	id:'electricity',               type:'item',                                                                productionLevel:0,    time:1,       output:900, inputs:{ steam:30 }, },
    {	id:'coal',                      type:'item',                                                                productionLevel:1,    time:4,       output:1,   },
    {	id:'iron',                      type:'item',                                                                productionLevel:1,    time:45,      output:11,  inputs:{ coal:1 }, },
    {	id:'ironPlate',                 type:'item',                                                                productionLevel:0,    time:3.2,     output:1,   inputs:{ iron:1 }, },
    {	id:'ironStick',                 type:'item',                                                                productionLevel:0,    time:.5,      output:2,   inputs:{ ironPlate:1 }, },
    {	id:'steelPlate',                type:'item',        reqs:[ 'steelProcessing' ],                             productionLevel:0,    time:32,      output:1,   inputs:{ ironPlate:10 }, },
    {	id:'pipe',                      type:'item',                                                                productionLevel:0,    time:.5,      output:1,   inputs:{ ironPlate:2 }, },
    {	id:'ironGearWheel',             type:'item',                                                                productionLevel:1,    time:.5,      output:1,   inputs:{ ironPlate:4 }, },
    {	id:'engine',                    type:'item',        reqs:[ 'engineTech' ],                                  productionLevel:0,    time:10,      output:1,   inputs:{ ironGearWheel:1, pipe:2, steelPlate:1 }, },
    {	id:'rail',                      type:'item',        reqs:[ 'railway' ],                                     productionLevel:0,    time:.5,      output:2,   inputs:{ ironStick:1, steelPlate:1, stone:1 }, },
    {	id:'electricEngine',            type:'item',        reqs:[ 'electricEngineTech' ],                          productionLevel:0,    time:10,      output:1,   inputs:{ electronicCircuit:2, engine:1, lubricant:15 }, },
    {	id:'grenade',                   type:'item',        reqs:[ 'military2' ],                                   productionLevel:0,    time:8,       output:1,   inputs:{ coal:10, ironPlate:5 }, },
    {	id:'radar',                     type:'item',                                                                productionLevel:0,    time:.5,      output:1,   inputs:{ electronicCircuit:5, ironGearWheel:5, ironPlate:10 }, },
    {	id:'exoskeleton',               type:'item',        reqs:[ 'exoskeletonTech' ],                             productionLevel:0,    time:10,      output:1,   inputs:{ electricEngine:30, processingUnit:10, steelPlate:20 }, },
    {	id:'uranium',                   type:'item',                                                                productionLevel:1,    time:8,       output:1,   },
    {	id:'uranium235',                type:'item',        reqs:[ 'kovarex', 'uraniumProcessing' ],                productionLevel:0,    time:12,      output:1,   inputs:{ uranium:993 }, },
    {	id:'uranium238',                type:'item',        reqs:[ 'kovarex', 'uraniumProcessing' ],                productionLevel:0,    time:12,      output:1,   inputs:{ uranium:7 }, },
    {	id:'water',                     type:'item',                                                                productionLevel:0,    time:.25,     output:10,  },
    {	id:'oil',                       type:'item',        reqs:[ 'oilProcessing1' ],                              productionLevel:0,    time:.25,     output:1,   },
    {	id:'heavyOil',                  type:'item',        reqs:[ 'oilProcessing1' ],                              productionLevel:0,    time:5,       output:25,  inputs:{ oil:100, water:50 }, },
    {	id:'petroleumGas',              type:'item',        reqs:[ 'oilProcessing1' ],                              productionLevel:0,    time:5,       output:45,  inputs:{ oil:100 }, },
    {	id:'lightOil',                  type:'item',        reqs:[ 'oilProcessing2' ],                              productionLevel:0,    time:2,       output:30,  inputs:{ heavyOil:40, water:30 }, },
    {	id:'solidFuel',                 type:'item',        reqs:[ 'oilProcessing2' ],                              productionLevel:0,    time:2,       output:1,   inputs:{ petroleumGas:20 }, },
    {	id:'lubricant',                 type:'item',        reqs:[ 'lubricantTech' ],                               productionLevel:0,    time:1,       output:10,  inputs:{ heavyOil:10 }, },
    {	id:'platicBar',                 type:'item',        reqs:[ 'plastics' ],                                    productionLevel:0,    time:1,       output:2,   inputs:{ coal:1, petroleumGas:20 }, },
    {	id:'sulfur',                    type:'item',        reqs:[ 'sulfurProcessing' ],                            productionLevel:0,    time:1,       output:2,   inputs:{ petroleumGas:30, water:30 }, },
    {	id:'sulfuricAcid',              type:'item',        reqs:[ 'sulfurProcessing' ],                            productionLevel:0,    time:1,       output:50,  inputs:{ ironPlate:1, sulfur:5, water:100 }, },
    {	id:'explosive',                 type:'item',        reqs:[ 'explosives' ],                                  productionLevel:0,    time:5,       output:2,   inputs:{ coal:2, sulfur:2, water:10 }, },
    {	id:'battery',                   type:'item',        reqs:[ 'batteryTech' ],                                 productionLevel:0,    time:5,       output:1,   inputs:{ copperPlate:1, ironPlate:1, sulfuricAcid:40 }, },
    {	id:'accumulator',               type:'item',        reqs:[ 'accumulatorTech' ],                             productionLevel:0,    time:10,      output:1,   inputs:{ battery:5, ironPlate:2 }, },
    {	id:'copper',                    type:'item',                                                                productionLevel:1,    time:45,      output:11,  inputs:{ coal:1 }, },
    {	id:'copperPlate',               type:'item',                                                                productionLevel:0,    time:3.2,     output:1,   inputs:{ copper:1 }, },
    {	id:'copperCable',               type:'item',                                                                productionLevel:1,    time:.5,      output:2,   inputs:{ copperPlate:1 }, },
    {	id:'electronicCircuit',         type:'item',        reqs:[ 'electronics1' ],                                productionLevel:1,    time:.5,      output:1,   inputs:{ copperCable:8, ironPlate:2 }, },
    {	id:'advancedCircuit',           type:'item',        reqs:[ 'electronics2' ],                                productionLevel:0,    time:6,       output:1,   inputs:{ copperCable:8, electronicCircuit:2, plasticBar:4 }, },
    {	id:'processingUnit',            type:'item',        reqs:[ 'electronics3' ],                                productionLevel:0,    time:10,      output:1,   inputs:{ advancedCircuit:2, electronicCircuit:20, sulfuricAcid:10 }, },
    {	id:'solarPanel',                type:'item',        reqs:[ 'solarEnergy' ],                                 productionLevel:0,    time:10,      output:1,   inputs:{ copperPlate:5, electronicCircuit:15, steelPlate:5 }, },
    {	id:'flyingRobot',               type:'item',        reqs:[ 'robotics' ],                                    productionLevel:0,    time:20,      output:1,   inputs:{ battery:2, electricEngine:1, electronicCircuit:3, steelPlate:1 }, },
    {	id:'portableReactor',           type:'item',        reqs:[ 'portableReactorTech' ],                         productionLevel:0,    time:10,      output:1,   inputs:{ lowDensityStructure:50, processingUnit:200 }, },
    {	id:'stone',                     type:'item',                                                                productionLevel:1,    time:45,      output:11,  inputs:{ coal:1 }, },
    {	id:'stoneBrick',                type:'item',                                                                productionLevel:0,    time:3.2,     output:1,   inputs:{ stone:2 }, },
    {	id:'wall',                      type:'item',        reqs:[ 'wallTech' ],                                    productionLevel:0,    time:.5,      output:1,   inputs:{ stoneBrick:5 }, },
    {	id:'concrete',                  type:'item',        reqs:[ 'concreteTech' ],                                productionLevel:0,    time:10,      output:10,  inputs:{ iron:1, stoneBrick:5, water:100 }, },
    {	id:'speedModule',               type:'item',        reqs:[ 'speed' ],                                       productionLevel:0,    time:15,      output:1,   inputs:{ advancedCircuit:5, electronicCircuit:5 }, },
    {	id:'efficiencyModule',          type:'item',        reqs:[ 'efficiency' ],                                  productionLevel:0,    time:15,      output:1,   inputs:{ advancedCircuit:5, electronicCircuit:5 }, },
    {	id:'productivityModule',        type:'item',        reqs:[ 'productivity' ],                                productionLevel:0,    time:15,      output:1,   inputs:{ advancedCircuit:5, electronicCircuit:5 }, },
    {	id:'rocketFuel',                type:'item',        reqs:[ 'rocketFuelTech' ],                              productionLevel:0,    time:30,      output:1,   inputs:{ lightOil:10, solidFuel:10 }, },
    {	id:'rocketControlUnit',         type:'item',        reqs:[ 'rocketControlUnitTech' ],                       productionLevel:0,    time:30,      output:1,   inputs:{ processingUnit:1, speedModule:1 }, },
    {	id:'lowDensityStructure',       type:'item',        reqs:[ 'lowDensityStructureTech' ],                     productionLevel:0,    time:20,      output:1,   inputs:{ copperPlate:20, plasticBar:30, steelPlate:2 }, },
    {	id:'rocketPart',                type:'item',        reqs:[ 'rocketTech' ],                                  productionLevel:0,    time:3,	    output:1,   inputs:{ electricity:4000, lowDensityStructure:10, rocketControlUnit:10, rocketFuel:10 }, },
    {	id:'satellite',                 type:'item',        reqs:[ 'spaceScience' ],                                productionLevel:0,    time:5,	    output:1,   inputs:{ electricity:375, accumulator:100, lowDensityStructure:100, processingUnit:100, radar:5, rocketFuel:50, solarPanel:100 }, },

    {	id:'redPack',                   type:'item',                                                                productionLevel:1,    time:5,	    output:1,   inputs:{ copperPlate:1, ironGearWheel:1 }, },
    {	id:'greenPack',                 type:'item',        reqs:[ 'greenScience' ],                                productionLevel:1,    time:7,	    output:1,   inputs:{ electronicCircuit:1, ironGearWheel:2, ironPlate:2 }, },
    {	id:'grayPack',                  type:'item',        reqs:[ 'grayScience' ],                                 productionLevel:1,    time:10,	    output:2,   inputs:{ grenade:1, bullet:1, wall:2 }, },
    {	id:'bluePack',                  type:'item',        reqs:[ 'blueScience' ],                                 productionLevel:1,    time:24,	    output:2,   inputs:{ advancedCircuit:3, engine:2, sulfur:1 }, },
    {	id:'purplePack',                type:'item',        reqs:[ 'purpleScience' ],                               productionLevel:1,    time:26,	    output:3,   inputs:{ advancedCircuit:5, steelPlate:10, stoneBrick:10, productivityModule:1, rail:30, alienEgg:1 }, },
    {	id:'yellowPack',                type:'item',        reqs:[ 'yellowScience' ],                               productionLevel:1,    time:21,	    output:3,   inputs:{ flyingRobot:1, lowDensityStructure:3, processingUnit:2 }, },
    
    {	id:'alienEgg',                  type:'base',        reqs:[ 'military1' ],                                   },
    
    {   id:'spitter1',                  type:'alien',       reqs:[ 'military1' ],                                   genCount:150,   health:10,      shield:{ physical:0,  explosion:0  },  armor:{ physical:0,   explosion:0   },  eggCoeff:.9,  },
    {   id:'biter1',                    type:'alien',       reqs:[ 'military1' ],                                   genCount:150,   health:15,      shield:{ physical:0,  explosion:0  },  armor:{ physical:0,   explosion:0   },  eggCoeff:.9,  },
    {   id:'spitter2',                  type:'alien',       reqs:[ 'military1' ],                                   genCount:100,   health:50,      shield:{ physical:0,  explosion:0  },  armor:{ physical:0,   explosion:.1  },  eggCoeff:.8,  },
    {   id:'biter2',                    type:'alien',       reqs:[ 'military1' ],                                   genCount:100,   health:75,      shield:{ physical:4,  explosion:0  },  armor:{ physical:.1,  explosion:.1  },  eggCoeff:.8,  },
    {   id:'spitter3',                  type:'alien',       reqs:[ 'military3' ],                                   genCount:100,   health:200,     shield:{ physical:0,  explosion:0  },  armor:{ physical:0,   explosion:.15 },  eggCoeff:.7,  },
    {   id:'worm1',                     type:'alien',       reqs:[ 'military1' ],                                   genCount:75,    health:200,     shield:{ physical:0,  explosion:0  },  armor:{ physical:0,   explosion:0   },  eggCoeff:.7,  },
    {   id:'biter3',                    type:'alien',       reqs:[ 'military3' ],                                   genCount:75,    health:375,     shield:{ physical:8,  explosion:0  },  armor:{ physical:.1,  explosion:.1  },  eggCoeff:.6,  },
    {   id:'worm2',                     type:'alien',       reqs:[ 'military2' ],                                   genCount:75,    health:400,     shield:{ physical:5,  explosion:5  },  armor:{ physical:0,   explosion:.15 },  eggCoeff:.6,  },
    {   id:'worm3',                     type:'alien',       reqs:[ 'military3' ],                                   genCount:50,    health:750,     shield:{ physical:10, explosion:10 },  armor:{ physical:0,   explosion:.3  },  eggCoeff:.5,  },
    {   id:'wormr4',                    type:'alien',       reqs:[ 'military4' ],                                   genCount:50,    health:750,     shield:{ physical:10, explosion:10 },  armor:{ physical:0,   explosion:.3  },  eggCoeff:.5,  },
    {   id:'spitter4',                  type:'alien',       reqs:[ 'military4' ],                                   genCount:50,    health:1500,    shield:{ physical:0,  explosion:0  },  armor:{ physical:0,   explosion:.3  },  eggCoeff:.4,  },
    {   id:'biter4',                    type:'alien',       reqs:[ 'military4' ],                                   genCount:30,    health:3000,    shield:{ physical:12, explosion:12 },  armor:{ physical:.1,  explosion:.1  },  eggCoeff:.3,  },    
    {   id:'nest',                      type:'alien',       reqs:[ 'military3' ],                                   genCount:1,     health:30000,   shield:{ physical:2,  explosion:5  },  armor:{ physical:.15, explosion:.15 },  eggCoeff:1.1, },

    {   id:'lab',                       type:'lab',                                                                 icon:'lab',     name:'lab',     time:3,    costs:{ electronicCircuit:10, ironGearWheel:12, ironPlate:2 }, },

    {   id:'bulletT1',                  type:'building',    reqs:[ 'military1', 'automation1' ],                    baseId:'bullet',                machine:hardcoreMachines.assembler1, },
    {   id:'bulletPiercingT1',          type:'building',    reqs:[ 'military2', 'automation1' ],                    baseId:'bulletPiercing',        machine:hardcoreMachines.assembler1, },
    {   id:'bulletUraniumT1',           type:'building',    reqs:[ 'uraniumAmmo', 'automation1' ],                  baseId:'bulletUranium',         machine:hardcoreMachines.assembler1, },
    {   id:'shotgunShellT1',            type:'building',    reqs:[ 'military1', 'automation1' ],                    baseId:'shotgunShell',          machine:hardcoreMachines.assembler1, },
    {   id:'piercingShellT1',           type:'building',    reqs:[ 'military4', 'automation1' ],                    baseId:'piercingShell',         machine:hardcoreMachines.assembler1, },
    {   id:'cannonShellT1',             type:'building',    reqs:[ 'tankTech', 'automation1' ],                     baseId:'cannonShell',           machine:hardcoreMachines.assembler1, },
    {   id:'explosiveShellT1',          type:'building',    reqs:[ 'tankTech', 'automation1' ],                     baseId:'explosiveShell',        machine:hardcoreMachines.assembler1, },
    {   id:'uraniumShellT1',            type:'building',    reqs:[ 'uraniumAmmo', 'automation1' ],                  baseId:'uraniumShell',          machine:hardcoreMachines.assembler1, },
    {   id:'rocketT1',                  type:'building',    reqs:[ 'rocketry1', 'automation1' ],                    baseId:'rocket',                machine:hardcoreMachines.assembler1, },
    {   id:'rocketExplosiveT1',         type:'building',    reqs:[ 'rocketry2', 'automation1' ],                    baseId:'explosiveRocket',       machine:hardcoreMachines.assembler1, },
    {   id:'atomicBombT1',              type:'building',    reqs:[ 'rocketry3', 'automation1' ],                    baseId:'atomicBomb',            machine:hardcoreMachines.assembler1, },
    {   id:'artilleryShellT1',          type:'building',    reqs:[ 'military4', 'automation1' ],                    baseId:'artilleryShell',        machine:hardcoreMachines.assembler1, },

    {	id:'coalT1',                    type:'building',                                                            baseId:'coal',                  machine:hardcoreMachines.drill1, },
    {	id:'steamT1',                   type:'building',                                                            baseId:'steam',                 machine:hardcoreMachines.boiler, },
    {	id:'electricityT1',             type:'building',                                                            baseId:'electricity',           machine:hardcoreMachines.steamEngine, },
    {	id:'ironT1',                    type:'building',                                                            baseId:'iron',                  machine:hardcoreMachines.drill1, },
    {	id:'ironPlateT1',               type:'building',                                                            baseId:'ironPlate',             machine:hardcoreMachines.furnace, },
    {	id:'ironStickT1',               type:'building',    reqs:[ 'automation1' ],                                 baseId:'ironStick',             machine:hardcoreMachines.assembler1, },
    {	id:'steelPlateT1',              type:'building',    reqs:[ 'steelProcessing' ],                             baseId:'steelPlate',            machine:hardcoreMachines.furnace, },
    {	id:'pipeT1',                    type:'building',    reqs:[ 'automation1' ],                                 baseId:'pipe',                  machine:hardcoreMachines.assembler1, },
    {	id:'ironGearWheelT1',           type:'building',    reqs:[ 'automation1' ],                                 baseId:'ironGearWheel',         machine:hardcoreMachines.assembler1, },
    {	id:'engineT1',                  type:'building',    reqs:[ 'engineTech', 'automation1' ],                   baseId:'engine',                machine:hardcoreMachines.assembler1, },
    {	id:'railT1',                    type:'building',    reqs:[ 'railway', 'automation1' ],                      baseId:'rail',                  machine:hardcoreMachines.assembler1, },
    {	id:'electricEngineT1',          type:'building',    reqs:[ 'electricEngineTech', 'automation1' ],           baseId:'electricEngine',        machine:hardcoreMachines.assembler1, },
    {	id:'grenadeT1',                 type:'building',    reqs:[ 'military2', 'automation1' ],                    baseId:'grenade',               machine:hardcoreMachines.assembler1, },
    {	id:'radarT1',                   type:'building',    reqs:[ 'automation1' ],                                 baseId:'radar',                 machine:hardcoreMachines.assembler1, },
    {	id:'exoskeletonT1',             type:'building',    reqs:[ 'exoskeletonTech', 'automation1' ],              baseId:'exoskeleton',           machine:hardcoreMachines.assembler1, },
    {	id:'uraniumT1',                 type:'building',                                                            baseId:'uranium',               machine:hardcoreMachines.drill2, },
    {	id:'uranium235T1',              type:'building',    reqs:[ 'kovarex', 'uraniumProcessing' ],                baseId:'uranium235',            machine:hardcoreMachines.centrifuge, },
    {	id:'uranium238T1',              type:'building',    reqs:[ 'kovarex', 'uraniumProcessing' ],                baseId:'uranium238',            machine:hardcoreMachines.centrifuge, },
    {	id:'waterT1',                   type:'building',                                                            baseId:'water',                 machine:hardcoreMachines.offshorePump, },
    {	id:'oilT1',                     type:'building',    reqs:[ 'oilProcessing1' ],                              baseId:'oil',                   machine:hardcoreMachines.pumpjack, },
    {	id:'heavyOilT1',                type:'building',    reqs:[ 'oilProcessing1' ],                              baseId:'heavyOil',              machine:hardcoreMachines.oilRefinery, },
    {	id:'petroleumGasT1',            type:'building',    reqs:[ 'oilProcessing1' ],                              baseId:'petroleumGas',          machine:hardcoreMachines.oilRefinery, },
    {	id:'lightOilT1',                type:'building',    reqs:[ 'oilProcessing1', 'oilProcessing2' ],            baseId:'lightOil',              machine:hardcoreMachines.chemicalPlant, },
    {	id:'solidFuelT1',               type:'building',    reqs:[ 'oilProcessing1', 'oilProcessing2' ],            baseId:'solidFuel',             machine:hardcoreMachines.chemicalPlant, },
    {	id:'lubricantT1',               type:'building',    reqs:[ 'oilProcessing1', 'lubricantTech' ],             baseId:'lubricant',             machine:hardcoreMachines.chemicalPlant, },
    {	id:'platicBarT1',               type:'building',    reqs:[ 'oilProcessing1', 'plastics' ],                  baseId:'platicBar',             machine:hardcoreMachines.chemicalPlant, },
    {	id:'sulfurT1',                  type:'building',    reqs:[ 'oilProcessing1', 'sulfurProcessing' ],          baseId:'sulfur',                machine:hardcoreMachines.chemicalPlant, },
    {	id:'sulfuricAcidT1',            type:'building',    reqs:[ 'oilProcessing1', 'sulfurProcessing' ],          baseId:'sulfuricAcid',          machine:hardcoreMachines.chemicalPlant, },
    {	id:'explosiveT1',               type:'building',    reqs:[ 'oilProcessing1', 'explosives' ],                baseId:'explosive',             machine:hardcoreMachines.chemicalPlant, },
    {	id:'batteryT1',                 type:'building',    reqs:[ 'oilProcessing1', 'batteryTech' ],               baseId:'battery',               machine:hardcoreMachines.chemicalPlant, },
    {	id:'accumulatorT1',             type:'building',    reqs:[ 'accumulatorTech', 'automation1' ],              baseId:'accumulator',           machine:hardcoreMachines.assembler1, },
    {	id:'copperT1',                  type:'building',                                                            baseId:'copper',                machine:hardcoreMachines.drill1, },
    {	id:'copperPlateT1',             type:'building',                                                            baseId:'copperPlate',           machine:hardcoreMachines.furnace, },
    {	id:'copperCableT1',             type:'building',    reqs:[ 'automation1' ],                                 baseId:'copperCable',           machine:hardcoreMachines.assembler1, },
    {	id:'electronicCircuitT1',       type:'building',    reqs:[ 'electronics1', 'automation1' ],                 baseId:'electronicCircuit',     machine:hardcoreMachines.assembler1, },
    {	id:'advancedCircuitT1',         type:'building',    reqs:[ 'electronics2', 'automation1' ],                 baseId:'advancedCircuit',       machine:hardcoreMachines.assembler1, },
    {	id:'processingUnitT1',          type:'building',    reqs:[ 'electronics3', 'automation1' ],                 baseId:'processingUnit',        machine:hardcoreMachines.assembler1, },
    {	id:'solarPanelT1',              type:'building',    reqs:[ 'solarEnergy', 'automation1' ],                  baseId:'solarPanel',            machine:hardcoreMachines.assembler1, },
    {	id:'flyingRobotT1',             type:'building',    reqs:[ 'robotics', 'automation1' ],                     baseId:'flyingRobot',           machine:hardcoreMachines.assembler1, },
    {	id:'portableReactorT1',         type:'building',    reqs:[ 'portableReactorTech', 'automation1' ],          baseId:'portableReactor',       machine:hardcoreMachines.assembler1, },
    {	id:'stoneT1',                   type:'building',                                                            baseId:'stone',                 machine:hardcoreMachines.drill1, },
    {	id:'stoneBrickT1',              type:'building',                                                            baseId:'stoneBrick',            machine:hardcoreMachines.furnace, },
    {	id:'wallT1',                    type:'building',    reqs:[ 'wallTech', 'automation1' ],                     baseId:'wall',                  machine:hardcoreMachines.assembler1, },
    {	id:'concreteT1',                type:'building',    reqs:[ 'concreteTech', 'automation2' ],                 baseId:'concrete',              machine:hardcoreMachines.assembler2, },
    {	id:'speedModuleT1',             type:'building',    reqs:[ 'speed', 'automation1' ],                        baseId:'speedModule',           machine:hardcoreMachines.assembler1, },
    {	id:'efficiencyModuleT1',        type:'building',    reqs:[ 'efficiency', 'automation1' ],                   baseId:'efficiencyModule',      machine:hardcoreMachines.assembler1, },
    {	id:'productivityModuleT1',      type:'building',    reqs:[ 'productivity', 'automation1' ],                 baseId:'productivityModule',    machine:hardcoreMachines.assembler1, },
    {	id:'rocketFuelT1',              type:'building',    reqs:[ 'rocketFuelTech', 'automation1' ],               baseId:'rocketFuel',            machine:hardcoreMachines.assembler1, },
    {	id:'rocketControlUnitT1',       type:'building',    reqs:[ 'rocketControlUnitTech', 'automation1' ],        baseId:'rocketControlUnit',     machine:hardcoreMachines.assembler1, },
    {	id:'lowDensityStructureT1',     type:'building',    reqs:[ 'lowDensityStructureTech', 'automation1' ],      baseId:'lowDensityStructure',   machine:hardcoreMachines.assembler1, },
    {	id:'rocketPartT1',              type:'building',    reqs:[ 'rocketTech' ],                                  baseId:'rocketPart',            machine:hardcoreMachines.rocketSilo, },
    {	id:'satelliteT1',               type:'building',    reqs:[ 'rocketTech', 'spaceScience' ],                  baseId:'satellite',             machine:hardcoreMachines.rocketSilo, },

    {	id:'redPackT1',                 type:'building',    reqs:[ 'automation1' ],                                 baseId:'redPack',               machine:hardcoreMachines.assembler1, },
    {	id:'greenPackT1',               type:'building',    reqs:[ 'greenScience', 'automation1' ],                 baseId:'greenPack',             machine:hardcoreMachines.assembler1, },
    {	id:'grayPackT1',                type:'building',    reqs:[ 'grayScience', 'automation1' ],                  baseId:'grayPack',              machine:hardcoreMachines.assembler1, },
    {	id:'bluePackT1',                type:'building',    reqs:[ 'blueScience', 'automation1' ],                  baseId:'bluePack',              machine:hardcoreMachines.assembler1, },
    {	id:'purplePackT1',              type:'building',    reqs:[ 'purpleScience', 'automation1' ],                baseId:'purplePack',            machine:hardcoreMachines.assembler1, },
    {	id:'yellowPackT1',              type:'building',    reqs:[ 'yellowScience', 'automation1' ],                baseId:'yellowPack',            machine:hardcoreMachines.assembler1, },
    
    {   id:'bulletS1',                  type:'storage',     reqs:[ 'military1', 'automation1' ],                    baseId:'bullet',                icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ bullet:50 }, },
    {   id:'bulletPiercingS1',          type:'storage',     reqs:[ 'military2', 'automation1' ],                    baseId:'bulletPiercing',        icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ bulletPiercing:50 }, },
    {   id:'bulletUraniumS1',           type:'storage',     reqs:[ 'uraniumAmmo', 'automation1' ],                  baseId:'bulletUranium',         icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ bulletUranium:50 }, },
    {   id:'shotgunShellS1',            type:'storage',     reqs:[ 'military1', 'automation1' ],                    baseId:'shotgunShell',          icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ shotgunShell:50 }, },
    {   id:'piercingShellS1',           type:'storage',     reqs:[ 'military4', 'automation1' ],                    baseId:'piercingShell',         icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ piercingShell:50 }, },
    {   id:'cannonShellS1',             type:'storage',     reqs:[ 'tankTech', 'automation1' ],                     baseId:'cannonShell',           icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ cannonShell:50 }, },
    {   id:'explosiveShellS1',          type:'storage',     reqs:[ 'tankTech', 'automation1' ],                     baseId:'explosiveShell',        icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ explosiveShell:50 }, },
    {   id:'uraniumShellS1',            type:'storage',     reqs:[ 'uraniumAmmo', 'automation1' ],                  baseId:'uraniumShell',          icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ uraniumShell:50 }, },
    {   id:'rocketS1',                  type:'storage',     reqs:[ 'rocketry1', 'automation1' ],                    baseId:'rocket',                icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ rocket:50 }, },
    {   id:'rocketExplosiveS1',         type:'storage',     reqs:[ 'rocketry2', 'automation1' ],                    baseId:'explosiveRocket',       icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ explosiveRocket:50 }, },
    {   id:'atomicBombS1',              type:'storage',     reqs:[ 'rocketry3', 'automation1' ],                    baseId:'atomicBomb',            icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ atomicBomb:50 }, },
    {   id:'artilleryShellS1',          type:'storage',     reqs:[ 'military4', 'automation1' ],                    baseId:'artilleryShell',        icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ artilleryShell:50 }, },

    {	id:'coalS1',                    type:'storage',     reqs:[ 'automation1' ],                                 baseId:'coal',                  icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ coal:50 }, },
    {	id:'steamS1',                   type:'storage',     reqs:[ 'fluidHandling' ],                               baseId:'steam',                 icon:'storageTank', name:'storageTank', storage:25000, time:10,    costs:{ steam:25000 }, },
    {	id:'electricityS1',             type:'storage',     reqs:[ 'accumulatorTech' ],                             baseId:'electricity',           icon:'accumulator', name:'accumulator', storage:300,   time:10,    costs:{ electricity:300 }, },
    {	id:'ironS1',                    type:'storage',     reqs:[ 'automation1' ],                                 baseId:'iron',                  icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ iron:50 }, },
    {	id:'ironPlateS1',               type:'storage',     reqs:[ 'automation1' ],                                 baseId:'ironPlate',             icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ ironPlate:50 }, },
    {	id:'ironStickS1',               type:'storage',     reqs:[ 'automation1' ],                                 baseId:'ironStick',             icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ ironStick:50 }, },
    {	id:'steelPlateS1',              type:'storage',     reqs:[ 'steelProcessing' ],                             baseId:'steelPlate',            icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ steelPlate:50 }, },
    {	id:'pipeS1',                    type:'storage',     reqs:[ 'automation1' ],                                 baseId:'pipe',                  icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ pipe:50 }, },
    {	id:'ironGearWheelS1',           type:'storage',     reqs:[ 'automation1' ],                                 baseId:'ironGearWheel',         icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ ironGearWheel:50 }, },
    {	id:'engineS1',                  type:'storage',     reqs:[ 'engineTech', 'automation1' ],                   baseId:'engine',                icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ engine:50 }, },
    {	id:'railS1',                    type:'storage',     reqs:[ 'railway', 'automation1' ],                      baseId:'rail',                  icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ rail:50 }, },
    {	id:'electricEngineS1',          type:'storage',     reqs:[ 'electricEngineTech', 'automation1' ],           baseId:'electricEngine',        icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ electricEngine:50 }, },
    {	id:'grenadeS1',                 type:'storage',     reqs:[ 'military2', 'automation1' ],                    baseId:'grenade',               icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ grenade:50 }, },
    {	id:'radarS1',                   type:'storage',     reqs:[ 'automation1' ],                                 baseId:'radar',                 icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ radar:50 }, },
    {	id:'exoskeletonS1',             type:'storage',     reqs:[ 'exoskeletonTech', 'automation1' ],              baseId:'exoskeleton',           icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ exoskeleton:50 }, },
    {	id:'uraniumS1',                 type:'storage',     reqs:[ 'automation1' ],                                 baseId:'uranium',               icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ uranium:50 }, },
    {	id:'uranium235S1',              type:'storage',     reqs:[ 'kovarex', 'uraniumProcessing' ],                baseId:'uranium235',            icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ uranium235:50 }, },
    {	id:'uranium238S1',              type:'storage',     reqs:[ 'kovarex', 'uraniumProcessing' ],                baseId:'uranium238',            icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ uranium238:50 }, },
    {	id:'waterS1',                   type:'storage',     reqs:[ 'fluidHandling' ],                               baseId:'water',                 icon:'storageTank', name:'storageTank', storage:25000, time:10,    costs:{ water:25000 }, },
    {	id:'oilS1',                     type:'storage',     reqs:[ 'fluidHandling' ],                               baseId:'oil',                   icon:'barrel',      name:'barrel',      storage:50,    time:10,    costs:{ oil:50 }, },
    {	id:'heavyOilS1',                type:'storage',     reqs:[ 'fluidHandling' ],                               baseId:'heavyOil',              icon:'barrel',      name:'barrel',      storage:50,    time:10,    costs:{ heavyOil:50 }, },
    {	id:'petroleumGasS1',            type:'storage',     reqs:[ 'fluidHandling' ],                               baseId:'petroleumGas',          icon:'barrel',      name:'barrel',      storage:50,    time:10,    costs:{ petroleumGas:50 }, },
    {	id:'lightOilS1',                type:'storage',     reqs:[ 'fluidHandling', 'oilProcessing2' ],             baseId:'lightOil',              icon:'barrel',      name:'barrel',      storage:50,    time:10,    costs:{ lightOil:50 }, },
    {	id:'solidFuelS1',               type:'storage',     reqs:[ 'oilProcessing1', 'oilProcessing2' ],            baseId:'solidFuel',             icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ solidFuel:50 }, },
    {	id:'lubricantS1',               type:'storage',     reqs:[ 'fluidHandling', 'lubricantTech' ],              baseId:'lubricant',             icon:'barrel',      name:'barrel',      storage:50,    time:10,    costs:{ lubricant:50 }, },
    {	id:'platicBarS1',               type:'storage',     reqs:[ 'oilProcessing1', 'plastics' ],                  baseId:'platicBar',             icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ platicBar:50 }, },
    {	id:'sulfurS1',                  type:'storage',     reqs:[ 'oilProcessing1', 'sulfurProcessing' ],          baseId:'sulfur',                icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ sulfur:50 }, },
    {	id:'sulfuricAcidS1',            type:'storage',     reqs:[ 'fluidHandling', 'sulfurProcessing' ],           baseId:'sulfuricAcid',          icon:'barrel',      name:'barrel',      storage:50,    time:10,    costs:{ sulfuricAcid:50 }, },
    {	id:'explosiveS1',               type:'storage',     reqs:[ 'oilProcessing1', 'explosives' ],                baseId:'explosive',             icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ explosive:50 }, },
    {	id:'batteryS1',                 type:'storage',     reqs:[ 'oilProcessing1', 'batteryTech' ],               baseId:'battery',               icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ battery:50 }, },
    {	id:'accumulatorS1',             type:'storage',     reqs:[ 'accumulatorTech', 'automation1' ],              baseId:'accumulator',           icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ accumulator:50 }, },
    {	id:'copperS1',                  type:'storage',     reqs:[ 'automation1' ],                                 baseId:'copper',                icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ copper:50 }, },
    {	id:'copperPlateS1',             type:'storage',     reqs:[ 'automation1' ],                                 baseId:'copperPlate',           icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ copperPlate:50 }, },
    {	id:'copperCableS1',             type:'storage',     reqs:[ 'automation1' ],                                 baseId:'copperCable',           icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ copperCable:50 }, },
    {	id:'electronicCircuitS1',       type:'storage',     reqs:[ 'electronics1', 'automation1' ],                 baseId:'electronicCircuit',     icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ electronicCircuit:50 }, },
    {	id:'advancedCircuitS1',         type:'storage',     reqs:[ 'electronics2', 'automation1' ],                 baseId:'advancedCircuit',       icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ advancedCircuit:50 }, },
    {	id:'processingUnitS1',          type:'storage',     reqs:[ 'electronics3', 'automation1' ],                 baseId:'processingUnit',        icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ processingUnit:50 }, },
    {	id:'solarPanelS1',              type:'storage',     reqs:[ 'solarEnergy', 'automation1' ],                  baseId:'solarPanel',            icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ solarPanel:50 }, },
    {	id:'flyingRobotS1',             type:'storage',     reqs:[ 'robotics', 'automation1' ],                     baseId:'flyingRobot',           icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ flyingRobot:50 }, },
    {	id:'portableReactorS1',         type:'storage',     reqs:[ 'portableReactorTech', 'automation1' ],          baseId:'portableReactor',       icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ portableReactor:50 }, },
    {	id:'stoneS1',                   type:'storage',     reqs:[ 'automation1' ],                                 baseId:'stone',                 icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ stone:50 }, },
    {	id:'stoneBrickS1',              type:'storage',     reqs:[ 'automation1' ],                                 baseId:'stoneBrick',            icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ stoneBrick:50 }, },
    {	id:'wallS1',                    type:'storage',     reqs:[ 'wallTech', 'automation1' ],                     baseId:'wall',                  icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ wall:50 }, },
    {	id:'concreteS1',                type:'storage',     reqs:[ 'concreteTech', 'automation1' ],                 baseId:'concrete',              icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ concrete:50 }, },
    {	id:'speedModuleS1',             type:'storage',     reqs:[ 'speed', 'automation1' ],                        baseId:'speedModule',           icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ speedModule:50 }, },
    {	id:'efficiencyModuleS1',        type:'storage',     reqs:[ 'efficiency', 'automation1' ],                   baseId:'efficiencyModule',      icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ efficiencyModule:50 }, },
    {	id:'productivityModuleS1',      type:'storage',     reqs:[ 'productivity', 'automation1' ],                 baseId:'productivityModule',    icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ productivityModule:50 }, },
    {	id:'rocketFuelS1',              type:'storage',     reqs:[ 'rocketFuelTech', 'automation1' ],               baseId:'rocketFuel',            icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ rocketFuel:50 }, },
    {	id:'rocketControlUnitS1',       type:'storage',     reqs:[ 'rocketControlUnitTech', 'automation1' ],        baseId:'rocketControlUnit',     icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ rocketControlUnit:50 }, },
    {	id:'lowDensityStructureS1',     type:'storage',     reqs:[ 'lowDensityStructureTech', 'automation1' ],      baseId:'lowDensityStructure',   icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ lowDensityStructure:50 }, },
    {	id:'rocketPartS1',              type:'storage',     reqs:[ 'rocketTech' ],                                  baseId:'rocketPart',            icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ rocketPart:50 }, },
    {	id:'satelliteS1',               type:'storage',     reqs:[ 'rocketTech', 'spaceScience' ],                  baseId:'satellite',             icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ satellite:50 }, },

    {	id:'redPackS1',                 type:'storage',     reqs:[ 'automation1' ],                                 baseId:'redPack',               icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ redPack:50 }, },
    {	id:'greenPackS1',               type:'storage',     reqs:[ 'greenScience', 'automation1' ],                 baseId:'greenPack',             icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ greenPack:50 }, },
    {	id:'grayPackS1',                type:'storage',     reqs:[ 'grayScience', 'automation1' ],                  baseId:'grayPack',              icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ grayPack:50 }, },
    {	id:'bluePackS1',                type:'storage',     reqs:[ 'blueScience', 'automation1' ],                  baseId:'bluePack',              icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ bluePack:50 }, },
    {	id:'purplePackS1',              type:'storage',     reqs:[ 'purpleScience', 'automation1' ],                baseId:'purplePack',            icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ purplePack:50 }, },
    {	id:'yellowPackS1',              type:'storage',     reqs:[ 'yellowScience', 'automation1' ],                baseId:'yellowPack',            icon:'chest',       name:'chest',       storage:50,    time:10,    costs:{ yellowPack:50 }, },
    
    {	id:'accumulatorTech',           type:'tech',        reqs:[ 'batteryTech', 'electricEnergy' ],                                                                               time:4500,      costs:{ redPack:150,   greenPack:150    }, },
    {	id:'automation1',               type:'tech',                                                                                                                                time:100,	    costs:{ redPack:10     }, },
    {	id:'automation2',               type:'tech',        reqs:[ 'electronics1', 'greenScience', 'steelProcessing' ],                                                             time:2400,	    costs:{ redPack:160,   greenPack:160    }, },
    {	id:'automobilism',              type:'tech',        reqs:[ 'engineTech', 'logistics2' ],                                                                                    time:12000,     costs:{ redPack:400,   greenPack:400    }, },
    {	id:'batteryTech',               type:'tech',        reqs:[ 'sulfurProcessing' ],                                                                                            time:18000,     costs:{ redPack:600,   greenPack:600    }, },
    {	id:'blueScience',               type:'tech',        reqs:[ 'sulfurProcessing', 'electronics2' ],                                                                            time:3000,      costs:{ redPack:300,   greenPack:300    }, },
    {	id:'concreteTech',              type:'tech',        reqs:[ 'automation2', 'material1' ],                                                                                    time:30000,     costs:{ redPack:1000,  greenPack:1000   }, },
    {	id:'efficiency',                type:'tech',        reqs:[ 'modules' ],                                                                                                     time:6000,      costs:{ redPack:200,   greenPack:200    }, },
    {	id:'electricEnergy',            type:'tech',        reqs:[ 'electronics1', 'greenScience', 'steelProcessing' ],                                                             time:14400,     costs:{ redPack:480,   greenPack:480    }, },
    {	id:'electricEngineTech',        type:'tech',        reqs:[ 'lubricantTech' ],                                                                                               time:6000,      costs:{ redPack:200,   greenPack:200    }, },
    {	id:'electronics1',              type:'tech',        reqs:[ 'automation1' ],                                                                                                 time:1800,      costs:{ redPack:120,   greenPack:120    }, },
    {	id:'electronics2',              type:'tech',        reqs:[ 'plastics' ],                                                                                                    time:12000,     costs:{ redPack:800,   greenPack:800    }, },
    {	id:'electronics3',              type:'tech',        reqs:[ 'blueScience' ],                                                                                                 time:36000,     costs:{ redPack:1200,  greenPack:1200   }, },
    {	id:'engineTech',                type:'tech',        reqs:[ 'greenScience', 'steelProcessing' ],                                                                             time:6000,      costs:{ redPack:400,   greenPack:400    }, },
    {	id:'exoskeletonTech',           type:'tech',        reqs:[ 'electronics3', 'electricEnergy', 'solarEnergy' ],                                                               time:6000,      costs:{ redPack:200,   greenPack:200,   bluePack:200   }, },
    {	id:'explosives',                type:'tech',        reqs:[ 'sulfurProcessing' ],                                                                                            time:6000,      costs:{ redPack:400,   greenPack:400    }, },
    {	id:'flammables',                type:'tech',        reqs:[ 'oilProcessing1' ],                                                                                              time:6000,      costs:{ redPack:200,   greenPack:200    }, },
    {	id:'fluidHandling',             type:'tech',        reqs:[ 'automation2', 'engineTech' ],                                                                                   time:3000,      costs:{ redPack:200,   greenPack:200    }, },
    {	id:'grayScience',               type:'tech',        reqs:[ 'military2', 'wallTech' ],                                                                                       time:1800,      costs:{ redPack:120,   greenPack:120    }, },
    {	id:'greenScience',              type:'tech',                                                                                                                                time:1500,      costs:{ redPack:300    }, },
    {	id:'heavyArmor',                type:'tech',        reqs:[ 'military1', 'steelProcessing' ],                                                                                time:3600,      costs:{ redPack:120    }, },
    {	id:'kovarex',                   type:'tech',        reqs:[ 'purpleScience', 'rocketFuelTech', 'uraniumProcessing' ],                                                        time:180000,    costs:{ redPack:6000,  greenPack:6000,  bluePack:6000,  purplePack:6000  }, },
    {	id:'logistics1',                type:'tech',                                                                                                                                time:1200,      costs:{ redPack:80,    greenPack:80     }, },
    {	id:'logistics2',                type:'tech',        reqs:[ 'greenScience', 'logistics1' ],                                                                                  time:24000,     costs:{ redPack:800,   greenPack:800    }, },
    {	id:'lowDensityStructureTech',   type:'tech',        reqs:[ 'material1', 'blueScience' ],                                                                                    time:54000,     costs:{ redPack:1200,  greenPack:1200,  bluePack:1200   }, },
    {	id:'lubricantTech',             type:'tech',        reqs:[ 'oilProcessing2' ],                                                                                              time:6000,      costs:{ redPack:200,   greenPack:200    }, },
    {	id:'material1',                 type:'tech',        reqs:[ 'greenScience', 'steelProcessing' ],                                                                             time:9000,      costs:{ redPack:300,   greenPack:300    }, },
    {	id:'military1',                 type:'tech',                                                                                                                                time:600,	    costs:{ redPack:40     }, },
    {	id:'military2',                 type:'tech',        reqs:[ 'military1', 'greenScience', 'steelProcessing' ],                                                                time:1200,      costs:{ redPack:80,    greenPack:80     }, },
    {	id:'military3',                 type:'tech',        reqs:[ 'grayScience', 'blueScience' ],                                                                                  time:12000,     costs:{ redPack:400,   greenPack:400,   grayPack:400,   bluePack:400     }, },
    {	id:'military4',                 type:'tech',        reqs:[ 'explosives', 'military3', 'yellowScience' ],                                                                    time:27000,     costs:{ redPack:600,   greenPack:600,   grayPack:600,   bluePack:600,    yellowPack:600    }, },
    {	id:'modularArmor',              type:'tech',        reqs:[ 'electronics2', 'heavyArmor' ],                                                                                  time:12000,     costs:{ redPack:400,   greenPack:400    }, },
    {	id:'modules',                   type:'tech',        reqs:[ 'electronics2' ],                                                                                                time:12000,     costs:{ redPack:400,   greenPack:400    }, },
    {	id:'oilProcessing1',            type:'tech',        reqs:[ 'fluidHandling' ],                                                                                               time:12000,     costs:{ redPack:400,   greenPack:400    }, },
    {	id:'oilProcessing2',            type:'tech',        reqs:[ 'blueScience' ],                                                                                                 time:9000,      costs:{ redPack:300,   greenPack:300,   bluePack:300    }, },
    {	id:'plastics',                  type:'tech',        reqs:[ 'oilProcessing1' ],                                                                                              time:18000,     costs:{ redPack:800,   greenPack:800    }, },
    {	id:'portableReactorTech',       type:'tech',        reqs:[ 'grayScience', 'powerArmor', 'yellowScience' ],                                                                  time:24000,     costs:{ redPack:800,   greenPack:800,   grayPack:800,   bluePack:800,    yellowPack:800    }, },
    {	id:'powerArmor',                type:'tech',        reqs:[ 'electronics3', 'electricEngine', 'modularArmor' ],                                                              time:24000,     costs:{ redPack:800,   greenPack:800,   bluePack:800    }, },                                              
    {	id:'productivity',              type:'tech',        reqs:[ 'modules' ],                                                                                                     time:6000,      costs:{ redPack:200,   greenPack:200    }, },
    {	id:'purpleScience',             type:'tech',        reqs:[ 'material2', 'productivity', 'railway' ],                                                                        time:12000,     costs:{ redPack:400,   greenPack:400,   bluePack:400    }, },
    {	id:'railway',                   type:'tech',        reqs:[ 'engineTech', 'logistics2' ],                                                                                    time:9000,      costs:{ redPack:300,   greenPack:300    }, },
    {	id:'robotics',                  type:'tech',        reqs:[ 'batteryTech', 'electricEngineTech' ],                                                                           time:9000,      costs:{ redPack:300,   greenPack:300,   bluePack:300    }, },
    {	id:'rocketControlUnitTech',     type:'tech',        reqs:[ 'speed', 'yellowScience' ],                                                                                      time:54000,     costs:{ redPack:1200,  greenPack:1200,  bluePack:1200,  yellowPack:1200  }, },
    {	id:'rocketFuelTech',            type:'tech',        reqs:[ 'oilProcessing2', 'flammables' ],                                                                                time:54000,     costs:{ redPack:1200,  greenPack:1200,  bluePack:1200   }, },
    {	id:'rocketry1',                 type:'tech',        reqs:[ 'explosives', 'flammables', 'grayScience' ],                                                                     time:7200,      costs:{ redPack:480,   greenPack:480,   grayPack:480    }, },
    {	id:'rocketry2',                 type:'tech',        reqs:[ 'rocketry1', 'military3' ],                                                                                      time:12000,     costs:{ redPack:400,   greenPack:400,   grayPack:400,   bluePack:400     }, },
    {	id:'rocketry3',                 type:'tech',        reqs:[ 'kovarex', 'military4', 'rocketControlUnitTech', 'rocketry1' ],                                                  time:900000,    costs:{ redPack:20000, greenPack:20000, grayPack:20000, bluePack:20000,  purplePack:20000, yellowPack:20000 }, },
    {	id:'rocketTech',                type:'tech',        reqs:[ 'concreteTech', 'productivity', 'rocketControlUnitTech', 'rocketFuelTech', 'speed' ],                            time:240000,    costs:{ redPack:4000,  greenPack:4000,  bluePack:4000,  purplePack:4000, yellowPack:4000   }, },
    {	id:'solarEnergy',               type:'tech',        reqs:[ 'electronics1', 'greenScience', 'optics', 'steelProcessing' ],                                                   time:30000,     costs:{ redPack:1000,  greenPack:1000   }, },
    {	id:'spaceScience',              type:'tech',        reqs:[ 'accumulatorTech', 'rocketTech', 'solarEnergy' ],                                                                time:240000,    costs:{ redPack:8000,  greenPack:8000,  bluePack:8000,  purplePack:8000, yellowPack:8000   }, },
    {	id:'speed',                     type:'tech',        reqs:[ 'modules' ],                                                                                                     time:6000,      costs:{ redPack:200,   greenPack:200    }, },
    {	id:'spidertronTech',            type:'tech',        reqs:[ 'efficiency', 'portableReactorTech', 'exoskeletonTech', 'military4', 'rocketControlUnitTech', 'rocketry1' ],     time:300000,    costs:{ redPack:10000, greenPack:10000, grayPack:10000, bluePack:10000,  purplePack:10000, yellowPack:10000 }, },
    {	id:'steelProcessing',           type:'tech',                                                                                                                                time:1000,      costs:{ redPack:200    }, },
    {	id:'sulfurProcessing',          type:'tech',        reqs:[ 'oilProcessing1' ],                                                                                              time:9000,      costs:{ redPack:600,   greenPack:600    }, },
    {	id:'tankTech',                  type:'tech',        reqs:[ 'automobilism', 'explosives', 'military3' ],                                                                     time:30000,     costs:{ redPack:1000,  greenPack:1000,  grayPack:1000,  bluePack:1000    }, },
    {	id:'uraniumAmmo',               type:'tech',        reqs:[ 'military4', 'tankTech', 'uraniumProcessing' ],                                                                  time:180000,    costs:{ redPack:4000,  greenPack:4000,  grayPack:4000,  bluePack:4000,   yellowPack:4000   }, },
    {	id:'uraniumProcessing',         type:'tech',        reqs:[ 'concreteTech', 'blueScience' ],                                                                                 time:24000,     costs:{ redPack:800,   greenPack:800,   bluePack:800    }, },
    {	id:'wallTech',                  type:'tech',                                                                                                                                time:400,       costs:{ redPack:40     }, },
    {	id:'yellowScience',             type:'tech',        reqs:[ 'electronics3', 'lowDensityStructureTech', 'robotics' ],                                                         time:12000,     costs:{ redPack:400,   greenPack:400,   bluePack:400    }, },

    {   id:'tut0',                      type:'tutorial',                                                            check: function() { return false },     action: function(app) { app.setCurrentTabId('production');    app.setCurrentProductionPageId('iron'); }, },
]

//------------------------------------------------------------------------------

var modesData = {

    easy: { data:easyData },
    hardcore: { data:hardcoreData },
}

//------------------------------------------------------------------------------

class Base {

    constructor(game, data) {
        
        this.game = game
        
        this.id = data.id
        this.type = data.type
        this.reqs = data.reqs
        
        this.count = 0
        this.unlocked = false
    }
    
    //---
    
    checkUnlocked() {
    
        if (this.unlocked == true) return
        if (this.reqs == null || this.reqs.length < 1) return
        
        let ret = true
        this.reqs.forEach(techId => {
            
            let tech = this.game.bases[techId]
            if (tech == null || tech.count < 1) ret = false
        })
        
        if (ret == true) this.unlocked = true
    }
}

//------------------------------------------------------------------------------

class Item extends Base {

    constructor(game, data) {
        super(game, data)
        
        this.max = data.max
        this.time = data.time
        this.desc = data.desc
        this.inputs = data.inputs
        this.output = data.output
        this.productionLevel = data.productionLevel
        
        this.auto = false
        this.state = 'paused'
        this.deltaCount = 0
        this.alienEggCount = 0
        this.remainingSeconds = this.getTime()
        
        this.storage = null
        this.building = null
    }
    
    //---
    
    getMax() {
        
        let ret = 0        
        ret += Math.floor(this.storage.storage * Math.pow(2.0, this.storage.count))
        
        if (ret == 0) ret = this.max
        
        return ret
    }
    
    getTime() {
    
        let ret = this.time
        ret /= 1 + (0.01 * this.alienEggCount)
        
        return ret
    }
    
    getInputs() {
        
        if (this.inputs == null) return null

        let bCount = Math.max(1, this.building.count)
        
        let ret = {}
        
        for (let id in this.inputs) {
            let input = this.inputs[id]
            
            ret[id] = input * bCount
        }
        
        return ret
    }
    
    getOutput() {
    
        let ret = this.output
        
        let bCount = Math.max(1, this.building.count)        
        ret *= bCount
        
        return ret
    }
    
    canProduce() {
        
        if (this.productionLevel == 0) return false
        
        let output = this.getOutput()
        if (this.count + this.deltaCount >= this.getMax()) {            
            return false
        }

        let inputs = this.getInputs()
        if (inputs == null) return true
        
        for (let id in inputs) {
            let input = inputs[id]
            
            if (id == 'alienEgg' && input > this.game.bases[id].count) {
                return false
            }
            else if (input > (this.game.bases[id].count + this.game.bases[id].deltaCount)) {            
                return false
            }
        }
        
        return true
    }
    
    getProd() {
    
        let ret = 0
        for (let id in this.game.items) {
            let item = this.game.items[id]
            if (item.state == 'running') {
                
                let time = item.getTime()
                
                let inputs = item.getInputs()
                if (inputs != null) {
                    for (let inputId in inputs) {
                        if (inputId == this.id) {                            
                            ret -= inputs[inputId] / time
                        }
                    }
                }                
            }
        }
        
        if (this.state == 'running') {
        
            let output = this.getOutput()
            ret += output / this.getTime()
        }
        
        return ret
    }
    
    //---
    
    startProducing() {
        
        if (this.canProduce() == true) {
        
            this.state = 'running'
            this.remainingSeconds = this.getTime()
            
            let inputs = this.getInputs()
            if (inputs != null) {
                for (let id in inputs) {
                    let input = inputs[id]
                    
                    this.game.bases[id].count -= input
                }
            }
        }
        else {
        
            this.state = 'waiting'
            this.remainingTime = this.getTime()
        }
    }
    
    pauseProducing() {
        
        if (this.state == 'running') {

            let inputs = this.getInputs()
            if (inputs != null) {
                for (let id in inputs) {
                    let input = inputs[id]
                    
                    this.game.bases[id].count += input
                    
                    if (this.game.bases[id].max) {
                        let max = this.game.bases[id].getMax()
                        if (max && this.game.bases[id].count > max) this.game.bases[id].count = max
                    }
                    else if (id == 'alienEgg') {
                        let max = this.game.getAlienEggMax()
                        if (max && this.game.bases[id].count > max) this.game.bases[id].count = max
                    }
                }
            }
        }
        
        this.state = 'paused'
        this.remainingSeconds = this.getTime()
    }
    
    produce(delta) {

        if (this.state == 'waiting') {
        
            this.startProducing()
        }        
        else if (this.state == 'running') {
        
            let time = this.remainingSeconds - delta            
            if (time <= 0) {
                                
                let output = this.getOutput()
                this.deltaCount += output

                if (this.auto == true) {
                
                    this.remainingSeconds = this.getTime()
                    this.startProducing()
                }
                else {
                
                    this.state = 'paused'
                    this.remainingSeconds = this.getTime()
                }
            }
            else {
            
                this.remainingSeconds = time
            }
        }
    }

    onProduce() {
    
        if (this.id == 'iron' && this.count >= 5) {
        
            this.game.bases['stone'].unlocked = true
            this.game.bases['ironPlate'].unlocked = true
            this.game.bases['ironPlateT1'].unlocked = true
        }
    }
}

//------------------------------------------------------------------------------

class Buildable extends Base {

    constructor(game, data) {
        super(game, data)
        
        this.time = data.time
        this.costs = data.costs
        this.remainingSeconds = data.time
        
        this.coeff = 1.12
        this.state = 'paused'
    }
    
    //---
    
    getTime() {
    
        let ret = this.time
        return ret
    }
    
    getCosts() {
    
        let ret = {}
        
        for (let id in this.costs) {
            let cost = this.costs[id]
            
            ret[id] = Math.floor(cost * Math.pow(this.coeff, this.count))
        }
        
        return ret
    }
    
    canBuild() {
    
        let costs = this.getCosts()
        for (let id in costs) {
            let cost = costs[id]
            
            if (cost > this.game.bases[id].count) {            
                return false
            }
        }
        
        return true
    }
    
    //---
    
    startBuilding() {
    
        if (this.canBuild() == true) {
            
            this.state = 'running'
            this.remainingSeconds = this.getTime()
            
            let costs = this.getCosts()
            for (let id in costs) {
                let cost = costs[id]
                
                this.game.items[id].count -= cost
            }
        }
    }
    
    cancelBuilding() {
    
        this.state = 'paused'
        this.remainingSeconds = this.getTime()
        
        let costs = this.getCosts()
        for (let id in costs) {
            let cost = costs[id]
            
            this.game.items[id].count += cost
            if (this.game.items[id].count > this.game.items[id].getMax()) this.game.items[id].count = this.game.items[id].getMax()
        }
    }
    
    build(delta) {
    
        if (this.state == 'running') {
        
            this.remainingSeconds -= delta            
            if (this.remainingSeconds <= 0) {
                                
                this.count += 1
                                    
                this.state = 'paused'
                this.remainingSeconds = this.getTime()
                
                this.onBuild()
            }
        }
    }
    
    onBuild() {}
}

//------------------------------------------------------------------------------

class Building extends Buildable {

    constructor(game, data) {
        super(game, data)
        
        this.time = data.machine.time
        this.costs = data.machine.costs
        
        this.icon = data.machine.icon
        this.name = data.machine.name
        
        this.remainingSeconds = this.getTime()
    }
    
    //---
    
    onBuild() {
        super.onBuild()
        
        if (this.id == 'ironPlateT1' && this.count >= 1) {
            
            this.game.bases['ironT1'].unlocked = true
            if (this.game.currentMode == 'hardcore') this.game.bases['ironGearWheel'].unlocked = true
        }

        if (this.id == 'ironT1' && this.count >= 1) {
        
            this.game.bases['stoneT1'].unlocked = true
        }
        
        if (this.id == 'stoneT1' && this.count >= 1) {
        
            this.game.bases['copper'].unlocked = true
            this.game.bases['copperT1'].unlocked = true
            this.game.bases['copperPlate'].unlocked = true            
            this.game.bases['copperPlateT1'].unlocked = true
        }

        if (this.id == 'copperPlateT1' && this.count >= 1) {
        
            this.game.lab.unlocked = true
            if (this.game.currentMode == 'hardcore') this.game.bases['electronicCircuit'].unlocked = true
        }
        
        this.item.auto = true
        this.item.productionLevel = 2
        
        if (this.item.building.count == 1) {
            this.item.startProducing()
        }
    }
}

//------------------------------------------------------------------------------

class Storage extends Buildable {

    constructor(game, data) {
        super(game, data)
        
        this.icon = data.icon
        this.name = data.name
        this.storage = data.storage
        
        this.coeff = 2
    }
}

//------------------------------------------------------------------------------

class Lab extends Buildable {

    constructor(game, data) {
        super(game, data)
        
        this.icon = data.icon
        this.name = data.name
        
        this.coeff = 1.5
        
        this.techs = []
    }
    
    //---
    
    onBuild() {
        super.onBuild()
        
        if (this.count >= 1) {
        
            this.game.items['redPack'].unlocked = true
            
            this.game.techs['automation1'].unlocked = true
        }
        
        for (let id in this.game.techs) {
            let tech = this.game.techs[id]
            
            if (tech.state != 'running') tech.remainingSeconds = tech.getTime()
        }
    }
}

//------------------------------------------------------------------------------

class Tech extends Buildable {

    constructor(game, data) {
        super(game, data)
    }
    
    //---
    
    getTime() {
    
        let ret = super.getTime() / this.lab.count
        return ret
    }

    canBuild() {
        
        let ret = 0
        
        for (let id in this.game.techs) {
            let tech = this.game.techs[id]
            
            if (tech.state == 'running') {
                ret += 1
            }
        }
        
        if (ret > 0) return false
        
        return super.canBuild()
    }
    
    //---
    
    onBuild() {
        super.onBuild()
        
        for (let id in this.game.bases) {
            let base = this.game.bases[id]
            if (base.unlocked == false) {
                base.checkUnlocked()
            }
        }
    }
}

//------------------------------------------------------------------------------

class Weapon extends Buildable {

    constructor(game, data) {
        super(game, data)
        
        this.id = data.id
        this.max = data.max
        this.auto = data.auto
        this.fireTime = data.fireTime
            
        this.fireState = 'paused'
        this.fireRemainingSeconds = this.getFireTime()
        
        this.ammunitions = []
    }
    
    //---
    
    getFireTime() {
    
        let ret = this.fireTime
        return ret
    }
    
    getRemainingShotCount() {
    
        let ret = 0
        
        for (let id in this.ammunitions) {
            let ammunition = this.ammunitions[id]
            
            ret += ammunition.count + ammunition.deltaCount
        }
        
        return ret
    }
    
    canFire() {
        
        if (this.count < 1) return false
        if (this.getRemainingShotCount() < 1) return false        
        if (this.game.getAlienCount() < 1) return false
        
        return true
    }    
    
    getAlienTarget() {
    
        let ret = null
        
        for (let id in this.game.aliens) {
            let alien = this.game.aliens[id]
            
            if (alien.totalHealth > 0) {
            
                ret = alien
                break
            }
        }
        
        return ret
    }
    
    getFireAmmunition() {

        let ret = null
        
        for (let id in this.ammunitions) {
            let ammunition = this.ammunitions[id]
            
            if (ammunition.count + ammunition.deltaCount > 0) {
            
                ret = ammunition
                break
            }
        }
        
        return ret
    }
    
    //---
    
    startFiring() {
        
        if (this.canFire() == true) {
            
            for (let id in this.game.weapons) {
            
                let weapon = this.game.weapons[id]
                weapon.cancelFiring()
            }
            
            this.fireState = 'running'
            this.fireRemainingSeconds = this.getFireTime()            
        }
        else {
        
            this.cancelFiring()
        }
    }
    
    cancelFiring() {
    
        this.fireState = 'paused'
        this.fireRemainingSeconds = this.getFireTime()        
    }
    
    fire(delta) {
    
        if (this.fireState == 'running') {
        
            this.fireRemainingSeconds -= delta            
            if (this.fireRemainingSeconds <= 0) {
                                
                let alien = this.getAlienTarget()
                let ammunition = this.getFireAmmunition()
                
                if (alien && ammunition) {
                
                    let totalDamage = 0
                    for (let id in ammunition.damages) {
                    
                        let armor = alien.armor[id]
                        let shield = alien.shield[id]
                        let damage = ammunition.damages[id]
                        
                        if (shield + 1 < damage) {
                            totalDamage += damage - shield
                        }
                        else if (damage > 1) {
                            totalDamage += 1 / (shield - damage + 2)
                        }
                        else {
                            totalDamage += 1 / (shield + 1)
                        }
                        
                        totalDamage = totalDamage * (1 - armor)
                    }
                    
                    ammunition.deltaCount -= 1
                    
                    let kill = alien.doDamage(totalDamage)
                    if (alien.id == 'nest' && kill > 0) {
                    
                         this.game.alienNestKilled += kill
                         if (this.game.currentMode == 'easy') this.game.stats.easyMode.totalAlienNests += kill
                    }
                    if (kill > 0) {
                    
                        let dice = Math.random()
                        if (dice * kill > alien.eggCoeff && this.game.bases['alienEgg'].count < this.game.getAlienEggMax()) {
                            
                            this.game.bases['alienEgg'].count += 1                                
                            if (this.game.currentMode == 'easy') this.game.stats.easyMode.totalAlienEggs += 1
                        }
                    }                
                    
                    if (this.auto) this.startFiring()
                    else this.cancelFiring()
                }
                else {
                
                    this.cancelFiring()
                }
            }
        }
    }
}

//------------------------------------------------------------------------------

class Ammunition extends Item {

    constructor(game, data) {
        super(game, data)
        
        this.icon = data.icon
        this.name = data.name
        this.damages = data.damages
    }    
}

//------------------------------------------------------------------------------

class Alien extends Base {

    constructor(game, data) {
        super(game, data)
        
        this.armor = data.armor
        this.shield = data.shield
        this.health = data.health
        this.genCount = data.genCount
        this.eggCoeff = data.eggCoeff
        
        this.totalHealth = 0
    }
    
    //---
    
    setCount(count) {
        
        if (count == null) count = 0
        
        this.count = count
        this.totalHealth = count * this.health
    }
    
    doDamage(damage) {
        
        let gap = 0
        
        this.totalHealth -= damage
        if (this.totalHealth < 0) this.totalHealth = 0
        
        let newCount = Math.ceil(this.totalHealth / this.health)
        if (newCount != this.count) {
            
            gap = this.count - newCount
            this.count = newCount
        }
        
        return gap
    }
}

//------------------------------------------------------------------------------

class Tutorial {

    constructor(game, data) {
        
        this.game = game
        
        this.id = data.id
        this.check = data.check
        this.action = data.action
        
        this.done = false
    }
}

//------------------------------------------------------------------------------

class Game {

    constructor() {
        
        this.paused = false
        this.victory = false
        this.timePlayed = 0
        this.currentMode = null
        this.alienNestKilled = 0
        
        this.initEasyMode()
        this.initHardcoreMode()
        
        this.options = {
        
            researchedTechs: true,
            startStopShortcut: true,
            upgradeStorageShortcut: false,
        }
        
        this.stats = {
        
            easyMode: {
            
                totalTimePlayed:0,
                totalAlienEggs:0,
                totalAlienNests:0,
                winTime:0,
            },
        }

        this.trophies = {
        
            easyMode: {
            
                win:false,
                oilProcessing:false,
                allResearches:false,
                
            },
        }
    }
    
    //---
    
    getWeaponCount() {
    
        let ret = 0
        
        for (let id in this.weapons) {
            let weapon = this.weapons[id]
            
            if (weapon.unlocked == true) {
                ret += 1
            }
        }
        
        return ret
    }
    
    getResearchedTechCount() {
    
        let ret = 0
        for (let id in this.techs) {
            let tech = this.techs[id]
            if (tech.count >= 1) {
                ret += 1
            }
        }
        
        return ret
    }
    
    getAlienCount() {
    
        let ret = 0
        
        for (let id in this.aliens) {
            let alien = this.aliens[id]
            
            ret += alien.count
        }
        
        return ret
    }
    
    getAlienEggMax() {
        
        let ret = 10 + (10 * this.alienNestKilled)
        return ret
    }
    
    //---
    
    initStartingData() {
        
        if (this.currentMode == null)  this.loadMode('easy')
        
        if (this.currentMode == 'easy') {
            
            if (this.bases['iron'].unlocked == false) this.bases['iron'].unlocked = true
            
            if (this.stats.easyMode.totalAlienEggs < this.bases['alienEgg'].count) this.stats.easyMode.totalAlienEggs = this.bases['alienEgg'].count            
        }
        else if (this.currentMode == 'hardcore') {

            if (this.bases['coal'].unlocked == false) this.bases['coal'].unlocked = true
            if (this.bases['iron'].unlocked == false) this.bases['iron'].unlocked = true
            if (this.bases['steam'].unlocked == false) this.bases['steam'].unlocked = true
            if (this.bases['steamT1'].unlocked == false) this.bases['steamT1'].unlocked = true
        }
        
        this.checkTrophies()
    }    
    
    initEasyMode() {
        
        this.easyBases = {}
        
        this.easyLab = null
        
        this.easyItems = {}
        this.easyTechs = {}
        this.easyAliens = {}
        this.easyWeapons = {}
        this.easyStorages = {}
        this.easyTutorials = {}
        this.easyBuildings = {}
        this.easyAmmunitions = {}
        
        modesData['easy'].data.forEach(data => {
            
            let base = null
            
            if (data.type == 'lab') { base = new Lab(this, data); this.easyLab = base; }
            else if (data.type == 'base') { base = new Base(this, data); }
            else if (data.type == 'tech') {
                base = new Tech(this, data); this.easyTechs[data.id] = base;
                
                base.lab = this.easyLab
                base.lab.techs.push(base)
            }
            else if (data.type == 'item') { base = new Item(this, data); this.easyItems[data.id] = base; }
            else if (data.type == 'alien') { base = new Alien(this, data); this.easyAliens[data.id] = base; }
            else if (data.type == 'weapon') { base = new Weapon(this, data); this.easyWeapons[data.id] = base; }
            else if (data.type == 'storage') {
                base = new Storage(this, data); this.easyStorages[data.id] = base;
        
                if (data.baseId) {
                
                    base.item = this.easyItems[data.baseId]
                    base.item.storage = base
                }
            }
            else if (data.type == 'tutorial') { base = new Tutorial(this, data); this.easyTutorials[data.id] = base; }
            else if (data.type == 'building') {
                base = new Building(this, data); this.easyBuildings[data.id] = base;
                
                if (data.baseId) {
                
                    base.item = this.easyItems[data.baseId]
                    base.item.building = base
                }
            }
            else if (data.type == 'ammunition') {
                base = new Ammunition(this, data); this.easyItems[data.id] = base; this.easyAmmunitions[data.id] = base;
        
                for (let weaponId of data.weaponIds) {
                
                    let weapon = this.easyWeapons[weaponId]
                    weapon.ammunitions.push(base)
                }
            }
            
            if (base) this.easyBases[data.id] = base
        })
    }
    
    initHardcoreMode() {
        
        this.hardcoreBases = {}
        
        this.hardcoreLab = null
        
        this.hardcoreItems = {}
        this.hardcoreTechs = {}
        this.hardcoreAliens = {}
        this.hardcoreWeapons = {}
        this.hardcoreStorages = {}
        this.hardcoreTutorials = {}
        this.hardcoreBuildings = {}
        this.hardcoreAmmunitions = {}
        
        modesData['hardcore'].data.forEach(data => {
            
            let base = null
            
            if (data.type == 'lab') { base = new Lab(this, data); this.hardcoreLab = base; }
            else if (data.type == 'base') { base = new Base(this, data); }
            else if (data.type == 'tech') {
                base = new Tech(this, data); this.hardcoreTechs[data.id] = base;
                
                base.lab = this.hardcoreLab
                base.lab.techs.push(base)
            }
            else if (data.type == 'item') { base = new Item(this, data); this.hardcoreItems[data.id] = base; }
            else if (data.type == 'alien') { base = new Alien(this, data); this.hardcoreAliens[data.id] = base; }
            else if (data.type == 'weapon') { base = new Weapon(this, data); this.hardcoreWeapons[data.id] = base; }
            else if (data.type == 'storage') {
                base = new Storage(this, data); this.hardcoreStorages[data.id] = base;
        
                if (data.baseId) {
                
                    base.item = this.hardcoreItems[data.baseId]
                    base.item.storage = base
                }
            }
            else if (data.type == 'tutorial') { base = new Tutorial(this, data); this.hardcoreTutorials[data.id] = base; }
            else if (data.type == 'building') {
                base = new Building(this, data); this.hardcoreBuildings[data.id] = base;
                
                if (data.baseId) {
                
                    base.item = this.hardcoreItems[data.baseId]
                    base.item.building = base
                }
            }
            else if (data.type == 'ammunition') {
                base = new Ammunition(this, data); this.hardcoreItems[data.id] = base; this.hardcoreAmmunitions[data.id] = base;
        
                for (let weaponId of data.weaponIds) {
                
                    let weapon = this.hardcoreWeapons[weaponId]
                    weapon.ammunitions.push(base)
                }
            }
            
            if (base) this.hardcoreBases[data.id] = base
        })
    }
    
    loadMode(mode) {
    
        this.currentMode = mode
        
        if (mode == 'easy') {
        
            this.bases = this.easyBases
            
            this.lab = this.easyLab
            
            this.items = this.easyItems
            this.techs = this.easyTechs
            this.aliens = this.easyAliens
            this.weapons = this.easyWeapons
            this.storages = this.easyStorages
            this.tutorials = this.easyTutorials
            this.buildings = this.easyBuildings
            this.ammunitions = this.easyAmmunitions
        }
        else if (mode == 'hardcore') {
        
            this.bases = this.hardcoreBases
            
            this.lab = this.hardcoreLab
            
            this.items = this.hardcoreItems
            this.techs = this.hardcoreTechs
            this.aliens = this.hardcoreAliens
            this.weapons = this.hardcoreWeapons
            this.storages = this.hardcoreStorages
            this.tutorials = this.hardcoreTutorials
            this.buildings = this.hardcoreBuildings
            this.ammunitions = this.hardcoreAmmunitions
        }
    }
    
    loadFromData(data) {
        
        this.loadMode(data.currentMode)
        
        if (data.paused != null) this.paused = data.paused
        if (data.victory != null) this.victory = data.victory
        if (data.timePlayed != null) this.timePlayed = data.timePlayed
        if (data.alienNestKilled != null) this.alienNestKilled = data.alienNestKilled
        
        if (data.options != null) {
        
            if (data.options.researchedTechs != null) this.options.researchedTechs = data.options.researchedTechs
            if (data.options.startStopShortcut != null) this.options.startStopShortcut = data.options.startStopShortcut
            if (data.options.upgradeStorageShortcut != null) this.options.upgradeStorageShortcut = data.options.upgradeStorageShortcut
        }
        
        if (data.stats != null) {
        
            if (data.stats.easyMode.totalTimePlayed != null) this.stats.easyMode.totalTimePlayed = data.stats.easyMode.totalTimePlayed
            if (data.stats.easyMode.totalAlienEggs != null) this.stats.easyMode.totalAlienEggs = data.stats.easyMode.totalAlienEggs
            if (data.stats.easyMode.totalAlienNests != null) this.stats.easyMode.totalAlienNests = data.stats.easyMode.totalAlienNests
            if (data.stats.easyMode.winTime != null) this.stats.easyMode.winTime = data.stats.easyMode.winTime            
        }
        
        if (data.alienEggCount != null) this.bases['alienEgg'].count = data.alienEggCount
        
        for (let id in data.items) {
            let dataItem = data.items[id]
            
            let item = this.items[id]
            if (item) {
            
                if (dataItem.unlocked) item.unlocked = dataItem.unlocked
                if (dataItem.count) item.count = dataItem.count
                if (dataItem.state) item.state = dataItem.state
                if (dataItem.alienEggCount) item.alienEggCount = dataItem.alienEggCount
                
                if (item.state == 'running') item.remainingSeconds = dataItem.remainingSeconds
                else item.remainingSeconds = item.getTime()
            }
        }
        
        for (let id in data.buildings) {
            let dataBuilding = data.buildings[id]
            
            let building = this.buildings[id]
            if (building) {
            
                building.unlocked = dataBuilding.unlocked
                building.count = dataBuilding.count
                building.state = dataBuilding.state
                if (building.state == 'running') building.remainingSeconds = dataBuilding.remainingSeconds
            }
        }
        
        for (let id in data.storages) {
            let dataStorage = data.storages[id]
            
            let storage = this.storages[id]
            if (storage) {
            
                storage.unlocked = dataStorage.unlocked
                storage.count = dataStorage.count
                storage.state = dataStorage.state
                if (storage.state == 'running') storage.remainingSeconds = dataStorage.remainingSeconds
            }
        }
        
        if (data.lab) {
        
            this.lab.unlocked = data.lab.unlocked
            this.lab.count = data.lab.count
            this.lab.state = data.lab.state
            if (this.lab.state == 'running') this.lab.remainingSeconds = data.lab.remainingSeconds
        }
        
        for (let id in data.techs) {
            let dataTech = data.techs[id]
            
            let tech = this.techs[id]
            if (tech) {
            
                tech.unlocked = dataTech.unlocked
                tech.count = dataTech.count
                tech.state = dataTech.state
                if (tech.state == 'running') tech.remainingSeconds = dataTech.remainingSeconds
            }
        }
        
        for (let id in data.weapons) {
            let dataWeapon = data.weapons[id]
            
            let weapon = this.weapons[id]
            if (weapon) {
            
                weapon.unlocked = dataWeapon.unlocked
                weapon.count = dataWeapon.count
                weapon.state = dataWeapon.state
                weapon.fireState = dataWeapon.fireState
                
                if (weapon.state == 'running') weapon.remainingSeconds = dataWeapon.remainingSeconds
                if (weapon.fireState == 'running') weapon.fireRemainingSeconds = dataWeapon.fireRemainingSeconds
            }
        }
                
        for (let id in data.aliens) {
            let dataAlien = data.aliens[id]
            
            let alien = this.aliens[id]
            if (alien) {
            
                alien.count = dataAlien.count
                alien.totalHealth = dataAlien.totalHealth
                if (!alien.totalHealth && alien.count > 0) alien.setCount(dataAlien.count)
            }
        }
         
        for (let id in data.tutorials) {
            let dataTutorial = data.tutorials[id]
            
            let tutorial = this.tutorials[id]
            if (tutorial) {
            
                tutorial.done = dataTutorial.done
            }
        }
        
        for (let id in this.items) {
            let item = this.items[id]
            if (item.count > 0) item.onProduce()
        }
        
        for (let id in this.buildings) {
            let building = this.buildings[id]
            if (building.count > 0) building.onBuild()
        }
        
        if (this.lab.count > 0) this.lab.onBuild()
        
        for (let id in this.techs) {
            let tech = this.techs[id]
            if (tech.count > 0) tech.onBuild()
        }
    }
    
    getSavedData() {
    
        let ret = {
            
            stats: this.stats,
            paused: this.paused,
            options: this.options,
            victory: this.victory,
            timePlayed: this.timePlayed,
            currentMode: this.currentMode,
            alienNestKilled: this.alienNestKilled,
            
            alienEggCount: this.bases['alienEgg'].count,
            
            lab: {
                unlocked: this.lab.unlocked,
                count: this.lab.count,
                state: this.lab.state,
                remainingSeconds: this.lab.remainingSeconds,
            },
            
            items: {},
            techs: {},
            aliens: {},
            weapons: {},
            storages: {},
            buildings: {},
            tutorials: {},
            ammunitions: {},
        }
        
        for (let id in this.items) {
            let item = this.items[id]
            
            ret.items[item.id] = {
            
                count: item.count,
                state: item.state,
                unlocked: item.unlocked,
                alienEggCount: item.alienEggCount,
                remainingSeconds: item.remainingSeconds,
            }
        }
        
        for (let id in this.buildings) {
            let building = this.buildings[id]
            
            ret.buildings[building.id] = {
            
                unlocked: building.unlocked,
                count: building.count,
                state: building.state,
                remainingSeconds: building.remainingSeconds,
            }
        }
        
        for (let id in this.storages) {
            let storage = this.storages[id]
            
            ret.storages[storage.id] = {
            
                unlocked: storage.unlocked,
                count: storage.count,
                state: storage.state,
                remainingSeconds: storage.remainingSeconds,
            }
        }
        
        for (let id in this.techs) {
            let tech = this.techs[id]
            
            ret.techs[tech.id] = {
            
                unlocked: tech.unlocked,
                count: tech.count,
                state: tech.state,
                remainingSeconds: tech.remainingSeconds,
            }
        }
        
        for (let id in this.weapons) {
            let weapon = this.weapons[id]
            
            ret.weapons[weapon.id] = {
            
                unlocked: weapon.unlocked,
                count: weapon.count,
                state: weapon.state,
                remainingSeconds: weapon.remainingSeconds,
                fireState: weapon.fireState,
                fireRemainingSeconds: weapon.fireRemainingSeconds,
            }
        }
                
        for (let id in this.aliens) {
            let alien = this.aliens[id]
            
            ret.aliens[alien.id] = {
            
                count: alien.count,
                totalHealth: alien.totalHealth,
            }
        }
        
        for (let id in this.tutorials) {
            let tutorial = this.tutorials[id]
            
            ret.tutorials[tutorial.id] = {
            
                done: tutorial.done,
            }
        }
        
        return ret
    }
    
    generateAliens() {
    
        for (let id in this.aliens) {
            let alien = this.aliens[id]
            if (alien.unlocked == true) {
            
                alien.setCount(Math.ceil(Math.random() * alien.genCount))
            }
        }
    }

    //---
    
    mainLoop(deltaTimeMs) {
        
        if (this.paused == false) {
        
            let delta = deltaTimeMs / 1000            
            
            let cycleCount = 1
            let cycleDelta = delta
            
            if (delta > 1) {
                
                cycleCount = Math.min(Math.floor(delta), 24 * 3600)
                cycleDelta = 1
            }
            
            this.timePlayed += cycleDelta * cycleCount
            
            if (this.currentMode == 'easy') this.stats.easyMode.totalTimePlayed = this.timePlayed
            
            for (let id in this.items) {
                let item = this.items[id]
                
                item.deltaCount = 0
            }
            
            for (let i = 0; i < cycleCount; i++) {    
                                
                for (let id in this.items) {
                    let item = this.items[id]
                    
                    item.produce(cycleDelta)
                }

                for (let id in this.weapons) {
                    let weapon = this.weapons[id]
                    
                    weapon.fire(delta)
                }
            }
            
            for (let id in this.items) {
                let item = this.items[id]                
                if (item.deltaCount != 0) {
                
                    item.count += item.deltaCount
                    
                    let max = item.getMax()
                    if (item.count >= max) item.count = max

                    item.onProduce()
                }
            }
            
            for (let id in this.buildings) {
                let building = this.buildings[id]
                
                building.build(delta)
            }
            
            for (let id in this.storages) {
                let storage = this.storages[id]
                
                storage.build(delta)
            }
            
            this.lab.build(delta)
            
            for (let id in this.techs) {
                let tech = this.techs[id]
                
                tech.build(delta)
            }
                        
            for (let id in this.weapons) {
                let weapon = this.weapons[id]
                
                weapon.build(delta)
            }
        }
        
        this.checkTrophies()
    }
    
    isVictory() {
        
        let ret = false
        
        if (this.currentMode == 'easy' && this.victory == false && this.items['rocketPart'].count >= 100) {
            ret = true
            
            if (this.stats.easyMode.totalTimePlayed < this.stats.easyMode.winTime) this.stats.easyMode.winTime = this.stats.easyMode.totalTimePlayed
        }
        
        if (this.currentMode == 'easy' && this.victory == true && this.stats.easyMode.winTime < 1) {
            this.stats.easyMode.winTime = this.stats.easyMode.totalTimePlayed
        }

        return ret
    }
    
    checkTrophies() {
    
        if (this.currentMode == 'easy') {
        
            if (this.victory == true) this.trophies.easyMode.win = true
            if (this.getResearchedTechCount() >= modesData[this.currentMode].data.filter(data => data.type == 'tech').length) this.trophies.easyMode.allResearches = true
        }
    }
}

//------------------------------------------------------------------------------

import LZString from 'lz-string'

export default {
    
    data() {
        return {
            
            fps: 60,
            error: null,
            locale: 'en',
            started: false,
            isMobile: false,
            rafHandle: null,
            autoSaveDelay: 30000,
            resetInProgress: false,
            lastFrameTimeMs: new Date().getTime(),
            localStorageName: 'fgfactory',
            importExportData: null,
            minLoadingTimerMS: 1000,
            
            //---

            toastText: null,
            toastType: 'info',
            toastTimeout: null,
            
            //---
            
            popupWipe: null,
            popupAlien: null,
            popupVictory: null,            
            popupSupport: null,
            popupOffline: null,
            popupTutorial: null,
            
            //---
            
            tutorialEnabled: true,
            
            //---
            
            currentTabId: 'production',
            
            catEnergyOpen: true,
            catIronworkOpen: true,
            catMasonryOpen: true,
            catElectronicOpen: true,
            catChemistryOpen: true,
            catRocketOpen: true,
            catTechOpen: true,
            catAmmunitionOpen: true,
            
            currentProductionPageId: 'iron',
            currentTechPageId: 'lab',
            currentWeaponsPageId: 'alienEgg',
            
            //---
            
            game: new Game(),            
        }
    },
    
    computed: {
        
        exportGameData() {
        
            let text = localStorage.getItem(this.localStorageName)
            return text
        },        
    },
    
    methods: {
        
        //---
        
        setCurrentTabId(tabId) { this.currentTabId = tabId },
        
        setCurrentProductionPageId(pageId) { this.currentProductionPageId = pageId },        
        setCurrentTechPageId(pageId) { this.currentTechPageId = pageId },
        setCurrentWeaponsPageId(pageId) { this.currentWeaponsPageId = pageId },
        
        //---
        
        gameBase(id) { return this.game.bases[id] },
        
        //---
        
        enableTutorial() {
        
            this.tutorialEnabled = true
            this.showPopupTutorial()
        },
        
        disableTutorial() {
        
            this.tutorialEnabled = false
        },
        
        processTutorial() {
        
            for (var tutId in this.game.tutorials) {
                if (this.game.tutorials[tutId].done == false) {
                    break
                }
            }
            
            let tut = this.game.tutorials[tutId]
            if (tut && tut.check() == true) {
                
                tut.done = true
                
                tut.action(this)                
                this.showPopupTutorial()
            }
            
        },
        
        //---
        
        showVictoryPopup() { this.popupVictory = true },
        
        showSupportPopup() { this.popupSupport = true },
        
        showWipeDataPopup() { this.popupWipe = true },
        
        showPopupTutorial() {
        
            for (var tutId in this.game.tutorials) {
                if (this.game.tutorials[tutId].done == false) {
                    break
                }
            }
            
            let tut = this.game.tutorials[tutId]
            if (tut) {
            
                tut.action(this)
                this.popupTutorial = tut
            }
        },
        
        showOfflinePopup(delta) { this.popupOffline = delta },
        
        showAlienPopup(alien) { this.popupAlien = alien },
        
        //---
        
        showToast(text, type) {
        
            if (this.toastTimeout) {
                clearTimeout(this.toastTimeout)
            }
            
            this.toastText = text
            this.toastType = type
            
            const self = this
            this.toastTimeout = setTimeout(function() { self.toastText = null }, 3e3)
        },
        
        //---
        
        manualSave() {
        
            this.save()
            this.showToast("Game saved in local storage!", "info")
        },
       
        pauseGame() {
        
            this.game.paused = true
            this.showToast("Game paused!", "info")
        },
        
        resumeGame() {
        
            this.game.paused = false
            this.showToast("Game resumed!", "info")
        },
        
        //---

        start() {
            
            try {
                
                this.load()                
                this.init()                
                this.update()
                                
                window.onbeforeunload = () => {
                
                    if (this.resetInProgress == false) {
                        this.save()
                    }
                }
                
                this.rafHandle = requestAnimationFrame(this.update)
                this.saveInterval = setInterval(() => { this.save() }, this.autoSaveDelay)
                
                if (this.tutorialEnabled == true) {
                    this.showPopupTutorial()
                }

                this.started = true
            }
            catch (error) {
                
                this.error = error                
                console.error(error)
            }
        },
        
        init() {
        
            this.game.initStartingData()
        },
        
        update() {
            
            this.rafHandle = requestAnimationFrame(this.update)
            
            let currentTimeMs = new Date().getTime()
            
            let deltaTimeMs = currentTimeMs - this.lastFrameTimeMs
            if (deltaTimeMs >= 1000 / this.fps) {            
                this.lastFrameTimeMs = currentTimeMs
                
                this.game.mainLoop(deltaTimeMs)
                
                if (this.game.isVictory() == true) {
                
                    this.game.paused = true
                    this.showVictoryPopup()
                }
                
                if (this.tutorialEnabled == true) {
                    this.processTutorial()
                }
            }
            
            if (deltaTimeMs > 15 * 60 * 1000) this.showOfflinePopup(deltaTimeMs)
        },
        
        load() {
            
            let loadedData = localStorage.getItem(this.localStorageName)
            if (loadedData && loadedData !== null && loadedData.length % 4 == 0) {
            
                let text = LZString.decompressFromBase64(loadedData)
                if (!text) return console.warn('Load failed')
                loadedData = JSON.parse(text)
                
                this.game.loadFromData(loadedData)
                
                if (loadedData.lastFrameTimeMs != null) this.lastFrameTimeMs = loadedData.lastFrameTimeMs
                if (loadedData.tutorialEnabled != null) this.tutorialEnabled = loadedData.tutorialEnabled
                
                if (loadedData.currentTabId != null) this.currentTabId = loadedData.currentTabId
        
                if (loadedData.catEnergyOpen != null) this.catEnergyOpen = loadedData.catEnergyOpen
                if (loadedData.catIronworkOpen != null) this.catIronworkOpen = loadedData.catIronworkOpen
                if (loadedData.catMasonryOpen != null) this.catMasonryOpen = loadedData.catMasonryOpen
                if (loadedData.catElectronicOpen != null) this.catElectronicOpen = loadedData.catElectronicOpen
                if (loadedData.catChemistryOpen != null) this.catChemistryOpen = loadedData.catChemistryOpen
                if (loadedData.catRocketOpen != null) this.catRocketOpen = loadedData.catRocketOpen
                if (loadedData.catTechOpen != null) this.catTechOpen = loadedData.catTechOpen
                if (loadedData.catAmmunitionOpen != null) this.catAmmunitionOpen = loadedData.catAmmunitionOpen
                
                if (loadedData.catMined != null) this.catMined = loadedData.catMined
                
                if (loadedData.currentProductionPageId != null) this.currentProductionPageId = loadedData.currentProductionPageId
            }
        },

        save() {
            
            let savedData = this.game.getSavedData()
            
            savedData.lastFrameTimeMs = this.lastFrameTimeMs
            savedData.tutorialEnabled = this.tutorialEnabled
            
            savedData.currentTabId = this.currentTabId
            
            savedData.catEnergyOpen = this.catEnergyOpen
            savedData.catIronworkOpen = this.catIronworkOpen
            savedData.catMasonryOpen = this.catMasonryOpen
            savedData.catElectronicOpen = this.catElectronicOpen
            savedData.catChemistryOpen = this.catChemistryOpen
            savedData.catRocketOpen = this.catRocketOpen
            savedData.catTechOpen = this.catTechOpen
            savedData.catAmmunitionOpen = this.catAmmunitionOpen
            
            savedData.catMined = this.catMined
            
            savedData.currentProductionPageId = this.currentProductionPageId
            
            let text = JSON.stringify(savedData)
            let compressed = LZString.compressToBase64(text)
            localStorage.setItem(this.localStorageName, compressed)
        },

        importGameData() {

            if (!this.importExportData || !this.importExportData.trim()) return this.showToast("No data to import!", "error")
            if (this.importExportData.length % 4 !== 0) return this.showToast("Data corrupted!", "error")
            
            this.resetInProgress = true
            
            localStorage.setItem(this.localStorageName, this.importExportData)
            window.location.reload()
        },

        resetGameData() {
            
            this.resetInProgress = true
            
            localStorage.removeItem(this.localStorageName)
            window.location.reload()
        },

        exportToClipboard() {
        
            navigator.clipboard.writeText(this.exportGameData)
            this.showToast("Game data in clipboard!", "info")
        },

        downloadGameData() {
        
            var element = document.createElement('a')
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.exportGameData))
            element.setAttribute('download', 'FGFactory_save_' + (new Date).getTime() + '.txt')

            element.style.display = 'none'
            document.body.appendChild(element)

            element.click()

            document.body.removeChild(element)
        },
    },

    created() {

        let txt = navigator.userAgent || navigator.vendor || window.opera
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(txt)) {
            this.isMobile = true
        }
        
        if (this.isMobile == false) {
            setTimeout(() => { this.start() }, this.minLoadingTimerMS)
        }
    },

    beforeDestroy() {
        
        if (this.toastTimeout) {
            clearTimeout(this.toastTimeout)
        }
        
        clearInterval(this.saveInterval)
        cancelAnimationFrame(this.rafHandle)
    },
}
</script>
