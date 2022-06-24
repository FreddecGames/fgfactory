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

        <div v-if="toastText" class="position-absolute" style="bottom:52px; right:25%; left:25%; z-index:100;">
            <div class="d-flex justify-content-center">
                <div class="toast show toast-body py-2 bg-transparent text-center">
                    <span :class="{ 'text-primary':toastType == 'info', 'text-danger':toastType == 'error', 'text-success':toastType == 'success' }" v-html="toastText"></span>
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
                            <span class="text-normal">Congrats!. You unlock <span class="text-white">Iron Plate</span> and <span class="text-white">Masonry</span> tab. As you see, you cannot produce <span class="text-white">Iron Plate</span> manually. You have to build a <span class="text-white">Stone Furnace</span> to do that. To build a <span class="text-white">Stone Furnace</span> you have to manually mine <span class="text-white">Stone</span>.</span>
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
                            <span class="text-normal">Now with <span class="text-white">Stone</span>, you could build a <span class="text-white">Stone Furnace</span> to automate <span class="text-white">Iron Plate</span> production.</span>
                        </div>
                        <div class="col-12">
                            <div class="text-uppercase text-muted small mb-1">Current Objective</div>
                            <div class="text-normal ps-4 mb-1"><i class="fas fa-fw fa-caret-right"></i> Build 1 <span class="text-white">Stone Furnace</span> to automate <span class="text-white">Iron Plate</span> production</div>
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
                            <span class="text-normal">So to continue to produce <span class="text-white">Iron Plate</span> automatically, you have to produce <span class="text-white">Iron</span> automatically too. To do that you have to build a <span class="text-white">Basic Drill</span>.</span>
                        </div>
                        <div class="col-12">
                            <div class="text-uppercase text-muted small mb-1">Current Objective</div>
                            <div class="text-normal ps-4 mb-1"><i class="fas fa-fw fa-caret-right"></i> Mine manually <span class="text-white">Stone</span> and <span class="text-white">Iron</span> to have enough <span class="text-white">Iron Plate</span></div>
                            <div class="text-normal ps-4 mb-1"><i class="fas fa-fw fa-caret-right"></i> Build 1 <span class="text-white">>Basic Drill</span></div>
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
                            <div class="text-normal ps-4 mb-1"><i class="fas fa-fw fa-caret-right"></i> Build 1 <span class="text-white">Stone Furnace</span> to automate <span class="text-white">Stone</span> production</div>
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
                            <div class="text-normal ps-4 mb-1"><i class="fas fa-fw fa-caret-right"></i> Build 1 <span class="text-white">Basic Drill</span> to automate <span class="text-white">Copper</span> production</div>
                            <div class="text-normal ps-4 mb-1"><i class="fas fa-fw fa-caret-right"></i> Build 1 <span class="text-white">Stone Furnace</span> to automate <span class="text-white">Copper Plate</span> production</div>
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
                            <span class="text-normal">Researches are performed in <span class="text-white">Lab</span>: one <span class="text-white">Lab</span> could perform one research at a time. So the more <span class="text-white">Labs</span> you have, the more researches you could perform in the same time.</span>
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
                            <span class="text-normal">Each research needs packs to be performed. Each research unlocks new productions, new buildings or new researches. THe first available research is <span class="text-white">Automation 1</span> that will unlock assembler 1 buildings and tier 1 storages.</span>
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
                            <span class="text-white h4">End of Tutorial</span>
                        </div>
                        <div class="col-12 text-center">
                            <span class="text-normal">You unlocked <span class="text-white">Assembler</span> buildings that allow you to automate packs production. So now, you know what to do to build <span class="text-white">Rocket</span> and to escape from this hostile planet: produce packs, perform researches, unlock new productions, produce more items!</span>
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
                    </div>
                </div>
            </div>
            
            <div class="position-fixed start-0 end-0 nav bg-1 d-flex align-items-end" style="top:50px; height:55px;">
                <div class="container">
                    <div class="row gx-0 align-items-center">
                        <TopMenuTab v-if="gameItem('iron').unlocked == true" tabId="ironwork" icon="fa-drum-steelpan" />
                        <TopMenuTab v-if="gameItem('stone').unlocked == true" tabId="masonry" icon="fa-home" />
                        <TopMenuTab v-if="gameItem('copper').unlocked == true" tabId="electronic" icon="fa-microchip" />
                        <TopMenuTab v-if="gameItem('water').unlocked == true" tabId="chemistry" icon="fa-atom" />
                        <TopMenuTab v-if="gameItem('rocketFuel').unlocked == true" tabId="rocket" icon="fa-rocket" />
                        <TopMenuTab v-if="game.lab.unlocked == true" tabId="techs" icon="fa-flask" />
                        <TopMenuTab v-if="gameAmmunition('bullet').unlocked == true" tabId="weapons" icon="fa-burn" />
                        <TopMenuTab tabId="trophies" icon="fa-trophy" class="ms-auto" />
                        <TopMenuTab tabId="settings" icon="fa-cogs" />
                    </div>
                </div>
            </div>
            
            <div v-if="currentTabId == 'ironwork' && gameItem('iron').unlocked == true" class="position-fixed top-0 bottom-0 start-0 end-0" style="margin-top:105px; margin-bottom:50px;">
                <div class="container py-3 scrollbar">
                    <div class="row gx-4 scrollbar">
                        <div class="col-auto scrollbar" style="width:275px;">
                            <div class="row g-3">
                                <div class="col-12">
                                    <div class="row g-1">
                                        <ButtonItem :item="gameItem('coal')" @click="setCurrentIronworkPageId('coal')" :active="currentIronworkPageId == 'coal'" />
                                        <ButtonItem :item="gameItem('iron')" @click="setCurrentIronworkPageId('iron')" :active="currentIronworkPageId == 'iron'" />
                                        <ButtonItem :item="gameItem('ironPlate')" @click="setCurrentIronworkPageId('ironPlate')" :active="currentIronworkPageId == 'ironPlate'" />
                                        <ButtonItem :item="gameItem('steelPlate')" @click="setCurrentIronworkPageId('steelPlate')" :active="currentIronworkPageId == 'steelPlate'" />
                                        <ButtonItem :item="gameItem('engine')" @click="setCurrentIronworkPageId('engine')" :active="currentIronworkPageId == 'engine'" />
                                        <ButtonItem :item="gameItem('electricEngine')" @click="setCurrentIronworkPageId('electricEngine')" :active="currentIronworkPageId == 'electricEngine'" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <PageItem v-if="currentIronworkPageId == 'coal'" :item="gameItem('coal')" />
                        <PageItem v-if="currentIronworkPageId == 'iron'" :item="gameItem('iron')" />
                        <PageItem v-if="currentIronworkPageId == 'ironPlate'" :item="gameItem('ironPlate')" />
                        <PageItem v-if="currentIronworkPageId == 'steelPlate'" :item="gameItem('steelPlate')" />
                        <PageItem v-if="currentIronworkPageId == 'engine'" :item="gameItem('engine')" />
                        <PageItem v-if="currentIronworkPageId == 'electricEngine'" :item="gameItem('electricEngine')" />
                    </div>
                </div>
            </div>
            
            <div v-if="currentTabId == 'masonry' && gameItem('stone').unlocked == true" class="position-fixed top-0 bottom-0 start-0 end-0" style="margin-top:105px; margin-bottom:50px;">
                <div class="container py-3 scrollbar">
                    <div class="row gx-4 scrollbar">
                        <div class="col-auto scrollbar" style="width:275px;">
                            <div class="row g-3">
                                <div class="col-12">
                                    <div class="row g-1">
                                        <ButtonItem :item="gameItem('wood')" @click="setCurrentMasonryPageId('wood')" :active="currentMasonryPageId == 'wood'" />
                                        <ButtonItem :item="gameItem('stone')" @click="setCurrentMasonryPageId('stone')" :active="currentMasonryPageId == 'stone'" />
                                        <ButtonItem :item="gameItem('stoneBrick')" @click="setCurrentMasonryPageId('stoneBrick')" :active="currentMasonryPageId == 'stoneBrick'" />
                                        <ButtonItem :item="gameItem('concrete')" @click="setCurrentMasonryPageId('concrete')" :active="currentMasonryPageId == 'concrete'" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <PageItem v-if="currentMasonryPageId == 'wood'" :item="gameItem('wood')" />
                        <PageItem v-if="currentMasonryPageId == 'stone'" :item="gameItem('stone')" />
                        <PageItem v-if="currentMasonryPageId == 'stoneBrick'" :item="gameItem('stoneBrick')" />
                        <PageItem v-if="currentMasonryPageId == 'concrete'" :item="gameItem('concrete')" />
                    </div>
                </div>
            </div>

            <div v-if="currentTabId == 'electronic' && gameItem('copper').unlocked == true" class="position-fixed top-0 bottom-0 start-0 end-0" style="margin-top:105px; margin-bottom:50px;">
                <div class="container py-3 scrollbar">
                    <div class="row gx-4 scrollbar">
                        <div class="col-auto scrollbar" style="width:275px;">
                            <div class="row g-3">
                                <div class="col-12">
                                    <div class="row g-1">
                                        <ButtonItem :item="gameItem('copper')" @click="setCurrentElectronicPageId('copper')" :active="currentElectronicPageId == 'copper'" />
                                        <ButtonItem :item="gameItem('copperPlate')" @click="setCurrentElectronicPageId('copperPlate')" :active="currentElectronicPageId == 'copperPlate'" />
                                        <ButtonItem :item="gameItem('processingUnit')" @click="setCurrentElectronicPageId('processingUnit')" :active="currentElectronicPageId == 'processingUnit'" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <PageItem v-if="currentElectronicPageId == 'copper'" :item="gameItem('copper')" />
                        <PageItem v-if="currentElectronicPageId == 'copperPlate'" :item="gameItem('copperPlate')" />
                        <PageItem v-if="currentElectronicPageId == 'processingUnit'" :item="gameItem('processingUnit')" />
                    </div>
                </div>
            </div>
            
            <div v-if="currentTabId == 'chemistry' && gameItem('water').unlocked == true" class="position-fixed top-0 bottom-0 start-0 end-0" style="margin-top:105px; margin-bottom:50px;">
                <div class="container py-3 scrollbar">
                    <div class="row gx-4 scrollbar">
                        <div class="col-auto scrollbar" style="width:275px;">
                            <div class="row g-3">
                                <div class="col-12">
                                    <div class="row g-1">
                                        <ButtonItem :item="gameItem('water')" @click="setCurrentChemistryPageId('water')" :active="currentChemistryPageId == 'water'" />
                                        <ButtonItem :item="gameItem('oil')" @click="setCurrentChemistryPageId('oil')"  :active="currentChemistryPageId == 'oil'" />
                                        <ButtonItem :item="gameItem('heavyOil')" @click="setCurrentChemistryPageId('heavyOil')" :active="currentChemistryPageId == 'heavyOil'" />
                                        <ButtonItem :item="gameItem('lubricant')" @click="setCurrentChemistryPageId('lubricant')" :active="currentChemistryPageId == 'lubricant'" />
                                        <ButtonItem :item="gameItem('lightOil')" @click="setCurrentChemistryPageId('lightOil')" :active="currentChemistryPageId == 'lightOil'" />
                                        <ButtonItem :item="gameItem('petroleumGas')" @click="setCurrentChemistryPageId('petroleumGas')" :active="currentChemistryPageId == 'petroleumGas'" />
                                        <ButtonItem :item="gameItem('plasticBar')" @click="setCurrentChemistryPageId('plasticBar')" :active="currentChemistryPageId == 'plasticBar'" />
                                        <ButtonItem :item="gameItem('solidFuel')" @click="setCurrentChemistryPageId('solidFuel')" :active="currentChemistryPageId == 'solidFuel'" />
                                        <ButtonItem :item="gameItem('sulfur')" @click="setCurrentChemistryPageId('sulfur')" :active="currentChemistryPageId == 'sulfur'" />
                                        <ButtonItem :item="gameItem('sulfuricAcid')" @click="setCurrentChemistryPageId('sulfuricAcid')" :active="currentChemistryPageId == 'sulfuricAcid'" />
                                        <ButtonItem :item="gameItem('battery')" @click="setCurrentChemistryPageId('battery')" :active="currentChemistryPageId == 'battery'" />
                                        <ButtonItem :item="gameItem('explosive')" @click="setCurrentChemistryPageId('explosive')" :active="currentChemistryPageId == 'explosive'" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <PageItem v-if="currentChemistryPageId == 'water'" :item="gameItem('water')" />
                        <PageItem v-if="currentChemistryPageId == 'oil'" :item="gameItem('oil')" />
                        <PageItem v-if="currentChemistryPageId == 'heavyOil'" :item="gameItem('heavyOil')" />
                        <PageItem v-if="currentChemistryPageId == 'lubricant'" :item="gameItem('lubricant')" />
                        <PageItem v-if="currentChemistryPageId == 'lightOil'" :item="gameItem('lightOil')" />
                        <PageItem v-if="currentChemistryPageId == 'petroleumGas'" :item="gameItem('petroleumGas')" />
                        <PageItem v-if="currentChemistryPageId == 'plasticBar'" :item="gameItem('plasticBar')" />
                        <PageItem v-if="currentChemistryPageId == 'solidFuel'" :item="gameItem('solidFuel')" />
                        <PageItem v-if="currentChemistryPageId == 'sulfur'" :item="gameItem('sulfur')" />
                        <PageItem v-if="currentChemistryPageId == 'sulfuricAcid'" :item="gameItem('sulfuricAcid')" />
                        <PageItem v-if="currentChemistryPageId == 'battery'" :item="gameItem('battery')" />
                        <PageItem v-if="currentChemistryPageId == 'explosive'" :item="gameItem('explosive')" />
                    </div>
                </div>
            </div>
            
            <div v-if="currentTabId == 'rocket' && gameItem('rocketFuel').unlocked == true" class="position-fixed top-0 bottom-0 start-0 end-0" style="margin-top:105px; margin-bottom:50px;">
                <div class="container py-3 scrollbar">
                    <div class="row gx-4 scrollbar">
                        <div class="col-auto scrollbar" style="width:275px;">
                            <div class="row g-3">
                                <div class="col-12">
                                    <div class="row g-1">
                                        <ButtonItem :item="gameItem('rocketFuel')" @click="setCurrentRocketPageId('rocketFuel')" :active="currentRocketPageId == 'rocketFuel'" />
                                        <ButtonItem :item="gameItem('rocketPart')" @click="setCurrentRocketPageId('rocketPart')" :active="currentRocketPageId == 'rocketPart'" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <PageItem v-if="currentRocketPageId == 'rocketFuel'" :item="gameItem('rocketFuel')" />
                        <PageItem v-if="currentRocketPageId == 'rocketPart'" :item="gameItem('rocketPart')" />
                    </div>
                </div>
            </div>
            
            <div v-if="currentTabId == 'techs' && game.lab.unlocked == true" class="position-fixed top-0 bottom-0 start-0 end-0" style="margin-top:105px; margin-bottom:50px;">
                <div class="container py-3 scrollbar">
                    <div class="row gx-4 scrollbar">
                        <div class="col-auto scrollbar" style="width:275px;">
                            <div class="row g-3">
                                <div class="col-12">
                                    <div class="row g-1">
                                        <ButtonLab :lab="game.lab" @click="setCurrentTechPageId('lab')" :active="currentTechPageId == 'lab'" />
                                        <ButtonItem :item="gameItem('redPack')" @click="setCurrentTechPageId('redPack')" :active="currentTechPageId == 'redPack'" />
                                        <ButtonItem :item="gameItem('greenPack')" @click="setCurrentTechPageId('greenPack')" :active="currentTechPageId == 'greenPack'" />
                                        <ButtonItem :item="gameItem('bluePack')" @click="setCurrentTechPageId('bluePack')" :active="currentTechPageId == 'bluePack'" />
                                        <ButtonItem :item="gameItem('purplePack')" @click="setCurrentTechPageId('purplePack')" :active="currentTechPageId == 'purplePack'" />
                                        <ButtonItem :item="gameItem('yellowPack')" @click="setCurrentTechPageId('yellowPack')" :active="currentTechPageId == 'yellowPack'" />
                                        <ButtonItem :item="gameItem('grayPack')" @click="setCurrentTechPageId('grayPack')" :active="currentTechPageId == 'grayPack'" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <PageLab v-if="currentTechPageId == 'lab'" :lab="game.lab" />
                        <PageItem v-if="currentTechPageId == 'redPack'" :item="gameItem('redPack')" />
                        <PageItem v-if="currentTechPageId == 'greenPack'" :item="gameItem('greenPack')" />
                        <PageItem v-if="currentTechPageId == 'bluePack'" :item="gameItem('bluePack')" />
                        <PageItem v-if="currentTechPageId == 'purplePack'" :item="gameItem('purplePack')" />
                        <PageItem v-if="currentTechPageId == 'yellowPack'" :item="gameItem('yellowPack')" />
                        <PageItem v-if="currentTechPageId == 'grayPack'" :item="gameItem('grayPack')" />
                    </div>
                </div>
            </div>            

            <div v-if="currentTabId == 'weapons' && gameWeapon('pistol').unlocked == true" class="position-fixed top-0 bottom-0 start-0 end-0" style="margin-top:105px; margin-bottom:50px;">
                <div class="container py-3 scrollbar">
                    <div class="row gx-4 scrollbar">
                        <div class="col-auto scrollbar" style="width:275px;">
                            <div class="row g-3">
                                <div class="col-12">
                                    <div class="row g-1">
                                        <ButtonItemCount :item="gameItem('alienEgg')" @click="setCurrentWeaponsPageId('alienEgg')" :active="currentWeaponsPageId == 'alienEgg'" />
                                        <ButtonItem :item="gameAmmunition('bullet')" @click="setCurrentWeaponsPageId('bullet')" :active="currentWeaponsPageId == 'bullet'" />
                                        <ButtonItem :item="gameAmmunition('piercing')" @click="setCurrentWeaponsPageId('piercing')" :active="currentWeaponsPageId == 'piercing'" />
                                        <ButtonItem :item="gameAmmunition('shotgunShell')" @click="setCurrentWeaponsPageId('shotgunShell')" :active="currentWeaponsPageId == 'shotgunShell'" />
                                        <ButtonItem :item="gameAmmunition('rocket')" @click="setCurrentWeaponsPageId('rocket')" :active="currentWeaponsPageId == 'rocket'" />
                                        <ButtonItem :item="gameAmmunition('artilleryShell')" @click="setCurrentWeaponsPageId('artilleryShell')" :active="currentWeaponsPageId == 'artilleryShell'" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <PageAlienEgg v-if="currentWeaponsPageId == 'alienEgg'" :item="gameItem('alienEgg')" />
                        <PageItem v-if="currentWeaponsPageId == 'bullet'" :item="gameAmmunition('bullet')" />
                        <PageItem v-if="currentWeaponsPageId == 'piercing'" :item="gameAmmunition('piercing')" />
                        <PageItem v-if="currentWeaponsPageId == 'shotgunShell'" :item="gameAmmunition('shotgunShell')" />
                        <PageItem v-if="currentWeaponsPageId == 'rocket'" :item="gameAmmunition('rocket')" />
                        <PageItem v-if="currentWeaponsPageId == 'artilleryShell'" :item="gameAmmunition('artilleryShell')" />
                    </div>
                </div>
            </div>            

            <div v-if="currentTabId == 'trophies'" class="position-fixed top-0 bottom-0 start-0 end-0" style="margin-top:105px; margin-bottom:50px;">
                <div class="container py-3 scrollbar">
                    <div class="row g-3">
                        <div class="col-6">
                            <div class="h-100 card">
                                <div class="card-header">
                                    <span>Statistics</span>
                                </div>
                                <div class="card-body">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th scope="col"></th>
                                                <th nowrap scope="col" width="1%" class="text-end text-muted">Easy Mode</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Total Time Played</td>
                                                <td nowrap class="text-end"><FormatTime :value="game.stats.easyMode.totalTimePlayed" /></td>
                                            </tr>
                                            <tr>
                                                <td>Total Alien Eggs Earned</td>
                                                <td nowrap class="text-end"><FormatNumber :value="game.stats.easyMode.totalAlienEggs" /></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="h-100 card">
                                <div class="card-header">
                                    <span>Achievements</span>
                                </div>
                                <div class="card-body">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th scope="col"></th>
                                                <th nowrap scope="col" width="1%" class="text-muted">Easy Mode</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Win the game</td>
                                                <td nowrap class="text-end"><i class="fas fa-fw fa-trophy" :class="{ 'text-success':game.trophies.easyMode.win, 'text-muted opacity-25':!game.trophies.easyMode.win }"></i></td>
                                            </tr>
                                            <tr>
                                                <td>Research Oil Processing 1</td>
                                                <td nowrap class="text-end"><i class="fas fa-fw fa-trophy" :class="{ 'text-success':game.trophies.easyMode.oilProcessing, 'text-muted opacity-25':!game.trophies.easyMode.oilProcessing }"></i></td>
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
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" v-model="game.options.researchedTechs" id="options_researchedTechs">
                                        <label class="form-check-label" for="options_researchedTechs">Show researched techs</label>
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

var itemData = [
    
    {	id:'coal',              productionLevel:1,    time:4,	    outputs:{ coal:1 },             },
    {	id:'iron',              productionLevel:1,    time:4,	    outputs:{ iron:1 },             },
    {	id:'ironPlate',         productionLevel:0,    time:3,	    outputs:{ ironPlate:1 },        inputs:{ iron:1 }, },
    {	id:'steelPlate',        productionLevel:0,    time:16,	    outputs:{ steelPlate:1 },       inputs:{ ironPlate:5 }, },
    {	id:'engine',            productionLevel:0,    time:12,	    outputs:{ engine:1 },           inputs:{ ironPlate:4, steelPlate:1 }, },
    {	id:'electricEngine',    productionLevel:0,    time:13,	    outputs:{ electricEngine:1 },   inputs:{ copperPlate:3, engine:1, ironPlate:2, lubricant:15 }, },
    {	id:'wood',              productionLevel:1,    time:10,	    outputs:{ wood:1 },             },
    {	id:'stone',             productionLevel:1,    time:4,	    outputs:{ stone:1 },            },
    {	id:'stoneBrick',        productionLevel:0,    time:3,	    outputs:{ stoneBrick:1 },       inputs:{ stone:2 }, },
    {	id:'concrete',          productionLevel:0,    time:10,	    outputs:{ concrete:10 },        inputs:{ iron:1, stoneBrick:5, water:100 }, },
    {	id:'copper',            productionLevel:1,    time:4,	    outputs:{ copper:1 },           },
    {	id:'copperPlate',       productionLevel:0,    time:3,       outputs:{ copperPlate:1 },      inputs:{ copper:1 }, },
    {	id:'processingUnit',    productionLevel:0,    time:54,      outputs:{ processingUnit:1 },   inputs:{ copperPlate:40, ironPlate:24, plasticBar:4, sulfuricAcid:5 }, },
    {	id:'water',             productionLevel:0,    time:1,	    outputs:{ water:12 },           },
    {	id:'oil',               productionLevel:0,    time:1,	    outputs:{ oil:12 },             },
    {	id:'heavyOil',          productionLevel:0,    time:5,	    outputs:{ heavyOil:25 },        inputs:{ oil:100, water:50 }, },
    {	id:'lubricant',         productionLevel:0,    time:1,	    outputs:{ lubricant:10 },       inputs:{ heavyOil:10 }, },
    {	id:'lightOil',          productionLevel:0,    time:2,	    outputs:{ lightOil:30 },        inputs:{ heavyOil:40, water:30 }, },
    {	id:'petroleumGas',      productionLevel:0,    time:5,	    outputs:{ petroleumGas:45 },    inputs:{ oil:100 }, },
    {	id:'plasticBar',        productionLevel:0,    time:1,	    outputs:{ plasticBar:2 },       inputs:{ petroleumGas:20 }, },
    {	id:'solidFuel',         productionLevel:0,    time:2,	    outputs:{ solidFuel:1 },        inputs:{ petroleumGas:20 }, },
    {	id:'sulfur',            productionLevel:0,    time:2,	    outputs:{ sulfur:2 },           inputs:{ petroleumGas:30, water:30 }, },
    {	id:'sulfuricAcid',      productionLevel:0,    time:1,	    outputs:{ sulfuricAcid:50 },    inputs:{ ironPlate:1, sulfur:5, water:100 }, },
    {	id:'battery',           productionLevel:0,    time:1,	    outputs:{ battery:50 },         inputs:{ copperPlate:1, ironPlate:1, sulfuricAcid:20 }, },
    {	id:'explosive',         productionLevel:0,    time:4,	    outputs:{ explosive:2 },        inputs:{ coal:1, sulfur:1, water:10 }, },
    {	id:'rocketFuel',        productionLevel:0,    time:30,	    outputs:{ rocketFuel:1 },       inputs:{ lightOil:10, solidFuel:10 }, },
    {	id:'rocketPart',        productionLevel:0,    time:1200,	outputs:{ rocketPart:1 },       inputs:{ copperPlate:525, ironPlate:150, plasticBar:150, processingUnit:10, rocketFuel:10, steelPlate:20 }, },
    {	id:'redPack',           productionLevel:1,    time:6,	    outputs:{ redPack:1 },          inputs:{ ironPlate:2, copperPlate:1 }, },
    {	id:'greenPack',         productionLevel:1,    time:9,	    outputs:{ greenPack:1 },        inputs:{ ironPlate:6, copperPlate:2 }, },
    {	id:'bluePack',          productionLevel:1,    time:53,	    outputs:{ bluePack:2 },         inputs:{ ironPlate:6, copperPlate:15, engine:2, plasticBar:6, sulfur:1 }, },
    {	id:'purplePack',        productionLevel:1,    time:154,	    outputs:{ purplePack:3 },       inputs:{ ironPlate:33, copperPlate:58, steelPlate:25, plasticBar:20, stone:15, stoneBrick:10, alienEgg:1 }, },
    {	id:'yellowPack',        productionLevel:1,    time:105,	    outputs:{ yellowPack:3 },       inputs:{ ironPlate:3, copperPlate:65, steelPlate:7, plasticBar:15, battery:2, processingUnit:2, electricEngine:1 }, },
    {	id:'grayPack',          productionLevel:1,    time:23,	    outputs:{ grayPack:2 },         inputs:{ coal:10, ironPlate:9, copperPlate:5, steelPlate:1, stoneBrick:10 }, },
    {	id:'alienEgg',          productionLevel:0,    },
]

var buildingData = [

    {	id:'coalT1',                icon:'miningDrill',         name:'miningDrill',         itemId:'coal',              productionLevel:2,  time:4,	    costs:{ ironPlate:9, stone:5 }, },
    {	id:'ironT1',                icon:'miningDrill',         name:'miningDrill',         itemId:'iron',              productionLevel:2,  time:4,	    costs:{ ironPlate:9, stone:5 }, },
    {	id:'ironPlateT1',           icon:'stoneFurnace',        name:'stoneFurnace',        itemId:'ironPlate',         productionLevel:2,  time:1,	    costs:{ stone:5 }, },
    {	id:'steelPlateT1',          icon:'stoneFurnace',        name:'stoneFurnace',        itemId:'steelPlate',        productionLevel:2,  time:1,	    costs:{ stone:5 }, },
    {	id:'engineT1',              icon:'assembler1',          name:'assembler1',          itemId:'engine',            productionLevel:2,  time:7,	    costs:{ copperPlate:5, ironPlate:22 }, },
    {	id:'electricEngineT1',      icon:'assembler1',          name:'assembler1',          itemId:'electricEngine',    productionLevel:2,  time:7,	    costs:{ copperPlate:8, ironPlate:22 }, },
    {	id:'woodT1',                icon:'constructionRobot',   name:'constructionRobot',   itemId:'wood',              productionLevel:2,  time:27,	costs:{ battery:2, copperPlate:8, electricEngine:1, ironPlate:5, steelPlate:1 }, },
    {	id:'stoneT1',               icon:'miningDrill',         name:'miningDrill',         itemId:'stone',             productionLevel:2,  time:4,	    costs:{ ironPlate:9, stone:5 }, },
    {	id:'stoneBrickT1',          icon:'stoneFurnace',        name:'stoneFurnace',        itemId:'stoneBrick',        productionLevel:2,  time:1,	    costs:{ stone:5 }, },
    {	id:'concreteT1',            icon:'assembler1',          name:'assembler1',          itemId:'concrete',          productionLevel:2,  time:7,	    costs:{ copperPlate:5, ironPlate:22 }, },
    {	id:'copperT1',              icon:'miningDrill',         name:'miningDrill',         itemId:'copper',            productionLevel:2,  time:4,	    costs:{ ironPlate:9, stone:5 }, },
    {	id:'copperPlateT1',         icon:'stoneFurnace',        name:'stoneFurnace',        itemId:'copperPlate',       productionLevel:2,  time:1,	    costs:{ stone:5 }, },
    {	id:'processingUnitT1',      icon:'assembler1',          name:'assembler1',          itemId:'processingUnit',    productionLevel:2,  time:7,	    costs:{ copperPlate:8, ironPlate:22 }, },
    {	id:'waterT1',               icon:'offshorePump',        name:'offshorePump',        itemId:'water',             productionLevel:2,  time:4,	    costs:{ copperPlate:3, ironPlate:5 }, },
    {	id:'oilT1',                 icon:'pumpjack',            name:'pumpjack',            itemId:'oil',               productionLevel:2,  time:21,    costs:{ copperPlate:8, ironPlate:35, steelPlate:5 }, },
    {	id:'heavyOilT1',            icon:'oilRefinery',         name:'oilRefinery',         itemId:'heavyOil',          productionLevel:2,  time:31,    costs:{ copperPlate:15, ironPlate:40, steelPlate:15, stoneBrick:10 }, },
    {	id:'lubricantT1',           icon:'chemicalPlant',       name:'chemicalPlant',       itemId:'lubricant',         productionLevel:2,  time:16,    costs:{ copperPlate:8, ironPlate:20, steelPlate:5 }, },
    {	id:'lightOilT1',            icon:'chemicalPlant',       name:'chemicalPlant',       itemId:'lightOil',          productionLevel:2,  time:16,    costs:{ copperPlate:8, ironPlate:20, steelPlate:5 }, },
    {	id:'petroleumGasT1',        icon:'oilRefinery',         name:'oilRefinery',         itemId:'petroleumGas',      productionLevel:2,  time:31,    costs:{ copperPlate:15, ironPlate:40, steelPlate:15, stoneBrick:10 }, },
    {	id:'plasticBarT1',          icon:'chemicalPlant',       name:'chemicalPlant',       itemId:'plasticBar',        productionLevel:2,  time:16,    costs:{ copperPlate:8, ironPlate:20, steelPlate:5 }, },
    {	id:'solidFuelT1',           icon:'chemicalPlant',       name:'chemicalPlant',       itemId:'solidFuel',         productionLevel:2,  time:16,    costs:{ copperPlate:8, ironPlate:20, steelPlate:5 }, },
    {	id:'sulfurT1',              icon:'chemicalPlant',       name:'chemicalPlant',       itemId:'sulfur',            productionLevel:2,  time:16,    costs:{ copperPlate:8, ironPlate:20, steelPlate:5 }, },
    {	id:'sulfuricAcidT1',        icon:'chemicalPlant',       name:'chemicalPlant',       itemId:'sulfuricAcid',      productionLevel:2,  time:16,    costs:{ copperPlate:8, ironPlate:20, steelPlate:5 }, },
    {	id:'batteryT1',             icon:'chemicalPlant',       name:'chemicalPlant',       itemId:'battery',           productionLevel:2,  time:16,    costs:{ copperPlate:8, ironPlate:20, steelPlate:5 }, },
    {	id:'explosiveT1',           icon:'chemicalPlant',       name:'chemicalPlant',       itemId:'explosive',         productionLevel:2,  time:16,    costs:{ copperPlate:8, ironPlate:20, steelPlate:5 }, },
    {	id:'rocketFuelT1',          icon:'assembler1',          name:'assembler1',          itemId:'rocketFuel',        productionLevel:2,  time:7,	    costs:{ copperPlate:8, ironPlate:22 }, },
    {	id:'rocketPartT1',          icon:'rocketSilo',          name:'rocketSilo',          itemId:'rocketPart',        productionLevel:2,  time:80,	costs:{ concrete:1000, electricEngine:200, ironPlate:100, processingUnit:200, steelPlate:1000 }, },
    {	id:'redPackT1',             icon:'assembler1',          name:'assembler1',          itemId:'redPack',           productionLevel:2,  time:7,	    costs:{ copperPlate:8, ironPlate:22 }, },
    {	id:'greenPackT1',           icon:'assembler1',          name:'assembler1',          itemId:'greenPack',         productionLevel:2,  time:7,	    costs:{ copperPlate:8, ironPlate:22 }, },
    {	id:'bluePackT1',            icon:'assembler1',          name:'assembler1',          itemId:'bluePack',          productionLevel:2,  time:7,	    costs:{ copperPlate:8, ironPlate:22 }, },
    {	id:'purplePackT1',          icon:'assembler1',          name:'assembler1',          itemId:'purplePack',        productionLevel:2,  time:7,	    costs:{ copperPlate:8, ironPlate:22 }, },
    {	id:'yellowPackT1',          icon:'assembler1',          name:'assembler1',          itemId:'yellowPack',        productionLevel:2,  time:7,	    costs:{ copperPlate:8, ironPlate:22 }, },
    {	id:'grayPackT1',            icon:'assembler1',          name:'assembler1',          itemId:'grayPack',          productionLevel:2,  time:7,	    costs:{ copperPlate:8, ironPlate:22 }, },

    {	id:'bulletT1',              icon:'assembler1',          name:'assembler1',          ammoId:'bullet',            productionLevel:2,  time:7,	    costs:{ copperPlate:8, ironPlate:22 }, },
    {	id:'piercingT1',            icon:'assembler1',          name:'assembler1',          ammoId:'piercing',          productionLevel:2,  time:7,	    costs:{ copperPlate:8, ironPlate:22 }, },
    {	id:'shotgunShellT1',        icon:'assembler1',          name:'assembler1',          ammoId:'shotgunShell',      productionLevel:2,  time:7,	    costs:{ copperPlate:8, ironPlate:22 }, },
    {	id:'rocketT1',              icon:'assembler1',          name:'assembler1',          ammoId:'rocket',            productionLevel:2,  time:7,	    costs:{ copperPlate:8, ironPlate:22 }, },
    {	id:'artilleryShellT1',      icon:'assembler1',          name:'assembler1',          ammoId:'artilleryShell',    productionLevel:2,  time:7,	    costs:{ copperPlate:8, ironPlate:22 }, },
]

var storageData = [

    {	id:'coalS1',                icon:'ironChest',               name:'ironChest',       itemId:'coal',              storage:50,    time:10,    costs:{ coal:50 }, },
    {	id:'ironS1',                icon:'ironChest',               name:'ironChest',       itemId:'iron',              storage:50,    time:10,    costs:{ iron:50 }, },
    {	id:'ironPlateS1',           icon:'ironChest',               name:'ironChest',       itemId:'ironPlate',         storage:50,    time:10,    costs:{ ironPlate:50 }, },
    {	id:'steelPlateS1',          icon:'ironChest',               name:'ironChest',       itemId:'steelPlate',        storage:50,    time:10,    costs:{ steelPlate:50 }, },
    {	id:'engineS1',              icon:'ironChest',               name:'ironChest',       itemId:'engine',            storage:50,    time:10,    costs:{ engine:50 }, },
    {	id:'electricEngineS1',      icon:'ironChest',               name:'ironChest',       itemId:'electricEngine',    storage:50,    time:10,    costs:{ electricEngine:50 }, },
    {	id:'woodS1',                icon:'ironChest',               name:'ironChest',       itemId:'wood',              storage:50,    time:10,    costs:{ wood:50 }, },
    {	id:'stoneS1',               icon:'ironChest',               name:'ironChest',       itemId:'stone',             storage:50,    time:10,    costs:{ stone:50 }, },
    {	id:'stoneBrickS1',          icon:'ironChest',               name:'ironChest',       itemId:'stoneBrick',        storage:50,    time:10,    costs:{ stoneBrick:50 }, },
    {	id:'concreteS1',            icon:'ironChest',               name:'ironChest',       itemId:'concrete',          storage:50,    time:10,    costs:{ concrete:50 }, },
    {	id:'copperS1',              icon:'ironChest',               name:'ironChest',       itemId:'copper',            storage:50,    time:10,    costs:{ copper:50 }, },
    {	id:'copperPlateS1',         icon:'ironChest',               name:'ironChest',       itemId:'copperPlate',       storage:50,    time:10,    costs:{ copperPlate:50 }, },
    {	id:'processingUnitS1',      icon:'ironChest',               name:'ironChest',       itemId:'processingUnit',    storage:50,    time:10,    costs:{ processingUnit:50 }, },
    {	id:'waterS1',               icon:'waterBarrel',             name:'barrel',          itemId:'water',             storage:50,    time:10,    costs:{ water:50 }, },
    {	id:'oilS1',                 icon:'oilBarrel',               name:'barrel',          itemId:'oil',               storage:50,    time:10,    costs:{ oil:50 }, },
    {	id:'heavyOilS1',            icon:'heavyOilBarrel',          name:'barrel',          itemId:'heavyOil',          storage:50,    time:10,    costs:{ heavyOil:50 }, },
    {	id:'lubricantS1',           icon:'lubricantBarrel',         name:'barrel',          itemId:'lubricant',         storage:50,    time:10,    costs:{ lubricant:50 }, },
    {	id:'lightOilS1',            icon:'lightOilBarrel',          name:'barrel',          itemId:'lightOil',          storage:50,    time:10,    costs:{ lightOil:50 }, },
    {	id:'petroleumGasS1',        icon:'petroleumGasBarrel',      name:'barrel',          itemId:'petroleumGas',      storage:50,    time:10,    costs:{ petroleumGas:50 }, },
    {	id:'plasticBarS1',          icon:'ironChest',               name:'ironChest',       itemId:'plasticBar',        storage:50,    time:10,    costs:{ plasticBar:50 }, },
    {	id:'solidFuelS1',           icon:'ironChest',               name:'ironChest',       itemId:'solidFuel',         storage:50,    time:10,    costs:{ solidFuel:50 }, },
    {	id:'sulfurS1',              icon:'ironChest',               name:'ironChest',       itemId:'sulfur',            storage:50,    time:10,    costs:{ sulfur:50 }, },
    {	id:'sulfuricAcidS1',        icon:'sulfuricAcidBarrel',      name:'barrel',          itemId:'sulfuricAcid',      storage:50,    time:10,    costs:{ sulfuricAcid:50 }, },
    {	id:'batteryS1',             icon:'ironChest',               name:'ironChest',       itemId:'battery',           storage:50,    time:10,    costs:{ battery:50 }, },
    {	id:'explosiveS1',           icon:'ironChest',               name:'ironChest',       itemId:'explosive',         storage:50,    time:10,    costs:{ explosive:50 }, },
    {	id:'rocketFuelS1',          icon:'ironChest',               name:'ironChest',       itemId:'rocketFuel',        storage:50,    time:10,    costs:{ rocketFuel:50 }, },
    {	id:'rocketPartS1',          icon:'ironChest',               name:'ironChest',       itemId:'rocketPart',        storage:50,    time:10,    costs:{ rocketPart:50 }, },
    {	id:'redPackS1',             icon:'ironChest',               name:'ironChest',       itemId:'redPack',           storage:50,    time:10,    costs:{ redPack:50 }, },
    {	id:'greenPackS1',           icon:'ironChest',               name:'ironChest',       itemId:'greenPack',         storage:50,    time:10,    costs:{ greenPack:50 }, },
    {	id:'bluePackS1',            icon:'ironChest',               name:'ironChest',       itemId:'bluePack',          storage:50,    time:10,    costs:{ bluePack:50 }, },
    {	id:'purplePackS1',          icon:'ironChest',               name:'ironChest',       itemId:'purplePack',        storage:50,    time:10,    costs:{ purplePack:50 }, },
    {	id:'yellowPackS1',          icon:'ironChest',               name:'ironChest',       itemId:'yellowPack',        storage:50,    time:10,    costs:{ yellowPack:50 }, },
    {	id:'grayPackS1',            icon:'ironChest',               name:'ironChest',       itemId:'grayPack',          storage:50,    time:10,    costs:{ grayPack:50 }, },

    {	id:'bulletS1',              icon:'ironChest',               name:'ironChest',       ammoId:'bullet',            storage:50,    time:10,    costs:{ bullet:50 }, },
    {	id:'piercingS1',            icon:'ironChest',               name:'ironChest',       ammoId:'piercing',          storage:50,    time:10,    costs:{ piercing:50 }, },
    {	id:'shotgunShellS1',        icon:'ironChest',               name:'ironChest',       ammoId:'shotgunShell',      storage:50,    time:10,    costs:{ shotgunShell:50 }, },
    {	id:'rocketS1',              icon:'ironChest',               name:'ironChest',       ammoId:'rocket',            storage:50,    time:10,    costs:{ rocket:50 }, },
    {	id:'artilleryShellS1',      icon:'ironChest',               name:'ironChest',       ammoId:'artilleryShell',    storage:50,    time:10,    costs:{ artilleryShell:50 }, },
]

var labData = { id:'lab', time:22,	costs:{ copperPlate:15, ironPlate:36 }, }

var techData = [

    {	id:'rocketTech',            time:60000,     costs:{ redPack:1000, greenPack:1000, bluePack:1000, purplePack:1000, yellowPack:1000 },    unlockItems:[ 'rocketPart' ], unlockBuildings:[ 'rocketPartT1' ], },
    {	id:'military4',             time:6750,      costs:{ redPack:150, greenPack:150, bluePack:150, grayPack:150, yellowPack:150 },           unlockWeapons:[ 'artilleryTurret'], unlockAmmunitions:[ 'artilleryShell' ], unlockBuildings:[ 'artilleryShellT1' ], unlockStorages:[ 'artilleryShellS1' ], },
    {	id:'rocketFuelTech',        time:13500,     costs:{ redPack:300, greenPack:300, bluePack:300 },                                         unlockItems:[ 'rocketFuel' ], unlockTechs:[ 'rocketTech' ], },
    {	id:'electronics',           time:9000,      costs:{ redPack:300, greenPack:300, bluePack:300 },                                         unlockItems:[ 'processingUnit' ], unlockTechs:[ 'alienTech', 'yellowScience' ], },
    {	id:'yellowScience',         time:3000,      costs:{ redPack:100, greenPack:100, bluePack:100 },                                         unlockItems:[ 'yellowPack' ], },
    {	id:'purpleScience',         time:3000,      costs:{ redPack:100, greenPack:100, bluePack:100 },                                         unlockItems:[ 'purplePack' ], },
    {	id:'robotics2',             time:3000,      costs:{ redPack:100, greenPack:100, bluePack:100 },                                         unlockBuildings:[ 'woodT1' ], },
    {	id:'military3',             time:3000,      costs:{ redPack:100, greenPack:100, bluePack:100, grayPack:100 },                           unlockWeapons:[ 'combatShotgun'], unlockTechs:[ 'military4' ], },
    {	id:'rocketry',              time:1800,      costs:{ redPack:120, greenPack:120, grayPack:120 },                                         unlockWeapons:[ 'rocketLauncher'], unlockAmmunitions:[ 'rocket' ], unlockBuildings:[ 'rocketT1' ], unlockStorages:[ 'rocketS1' ], },
    {	id:'oilTech2',              time:2250,      costs:{ redPack:75, greenPack:75, bluePack:75 },                                            unlockItems:[ 'solidFuel' ], unlockTechs:[ 'lubricantTech', 'rocketFuelTech', 'electronics' ], },
    {	id:'robotics1',             time:2250,      costs:{ redPack:75, greenPack:75, bluePack:75 },                                            unlockTechs:[ 'robotics2' ], },
    {	id:'electricEngineTech',    time:3000,      costs:{ redPack:50, greenPack:50, bluePack:50 },                                            unlockItems:[ 'electricEngine' ], unlockTechs:[ 'robotics1' ], },
    {	id:'lubricantTech',         time:3000,      costs:{ redPack:50, greenPack:50, bluePack:50 },                                            unlockItems:[ 'lubricant' ], unlockTechs:[ 'electricEngineTech' ], },
    {	id:'alienTech',             time:9000,      costs:{ redPack:300, greenPack:300 },                                                       unlockItems:[ 'alienEgg' ], unlockTechs:[ 'purpleScience', 'military1' ], unlockWeapons:[ 'pistol' ], unlockAmmunitions:[ 'bullet' ], unlockBuildings:[ 'bulletT1' ], unlockStorages:[ 'bulletS1' ], },
    {	id:'concreteTech',          time:7500,      costs:{ redPack:250, greenPack:250 },                                                       unlockItems:[ 'concrete' ], },
    {	id:'plastics',              time:6000,      costs:{ redPack:200, greenPack:200 },                                                       unlockItems:[ 'plasticBar' ], },
    {	id:'batteryTech',           time:4500,      costs:{ redPack:150, greenPack:150 },                                                       unlockItems:[ 'battery' ], unlockBuildings:[ 'batteryT1' ], },
    {	id:'sulfurTech',            time:4500,      costs:{ redPack:150, greenPack:150 },                                                       unlockItems:[ 'sulfur', 'sulfuricAcid' ], unlockTechs:[ 'batteryTech', 'blueScience', 'explosives' ], },
    {	id:'oilTech1',              time:3000,      costs:{ redPack:100, greenPack:100 },                                                       unlockItems:[ 'oil', 'heavyOil', 'lightOil', 'petroleumGas' ], unlockBuildings:[ 'oilT1', 'heavyOilT1', 'lubricantT1', 'lightOilT1', 'petroleumGasT1', 'plasticBarT1', 'solidFuelT1', 'sulfurT1', 'sulfuricAcidT1' ], unlockStorages:[ 'oilS1', 'heavyOilS1', 'lightOilS1', 'lubricantS1', 'petroleumGasS1', 'sulfurS1', 'sulfuricAcidS1' ], unlockTechs:[ 'plastics', 'sulfurTech' ], },
    {	id:'explosives',            time:1500,      costs:{ redPack:100, greenPack:100 },                                                       unlockItems:[ 'coal', 'explosive' ], unlockBuildings:[ 'coalT1', 'explosiveT1' ], unlockStorages:[ 'coalS1', 'explosiveS1' ], unlockTechs:[ 'grayScience' ], },
    {	id:'engineTech',            time:1500,      costs:{ redPack:100, greenPack:100 },                                                       unlockItems:[ 'engine' ], unlockTechs:[ 'fluidHandling' ], },
    {	id:'blueScience',           time:750,       costs:{ redPack:75, greenPack:75 },                                                         unlockItems:[ 'bluePack' ], unlockTechs:[ 'oilTech2' ], },
    {	id:'fluidHandling',         time:750,       costs:{ redPack:50, greenPack:50 },                                                         unlockItems:[ 'water' ], unlockBuildings:[ 'waterT1' ], unlockStorages:[ 'waterS1' ], unlockTechs:[ 'oilTech1' ], },
    {	id:'automation2',           time:600,       costs:{ redPack:40, greenPack:40 },                                                         unlockTechs:[ 'concreteTech' ], },
    {	id:'grayScience',           time:450,	    costs:{ redPack:30, greenPack:30 },                                                         unlockItems:[ 'grayPack' ], unlockBuildings:[ 'grayPackT1' ], unlockStorages:[ 'grayPackS1' ], unlockTechs:[ 'rocketry' ], },
    {	id:'military2',             time:300,	    costs:{ redPack:20, greenPack:20 },                                                         unlockAmmunitions:[ 'piercing' ], unlockBuildings:[ 'piercingT1' ], unlockStorages:[ 'piercingS1' ], unlockTechs:[ 'military3' ], },
    {	id:'greenScience',          time:375,       costs:{ redPack:75 },                                                                       unlockItems:[ 'greenPack' ], unlockTechs:[ 'automation2' ], },
    {	id:'steelTech',             time:250,       costs:{ redPack:50 },                                                                       unlockItems:[ 'steelPlate' ], unlockBuildings:[ 'steelPlateT1' ], unlockTechs:[ 'engineTech' ], },
    {	id:'military1',             time:150,	    costs:{ redPack:10 },                                                                       unlockItems:[ 'wood' ], unlockBuildings:['shotgunShellT1' ], unlockStorages:[ 'woodS1', 'shotgunShellS1' ], unlockWeapons:[ 'submachine', 'shotgun' ], unlockAmmunitions:[ 'shotgunShell' ], unlockTechs:[ 'military2' ], },
    {	id:'automation1',           time:100,	    costs:{ redPack:10 },                                                                       unlockItems:[ 'stoneBrick' ], unlockBuildings:[ 'stoneBrickT1', 'concreteT1', 'engineT1', 'electricEngineT1', 'processingUnitT1', 'rocketFuelT1', 'redPackT1', 'greenPackT1', 'bluePackT1', 'purplePackT1', 'yellowPackT1' ], unlockStorages:[ 'stoneS1', 'stoneBrickS1', 'concreteS1', 'ironS1', 'ironPlateS1', 'steelPlateS1', 'engineS1', 'electricEngineS1', 'copperS1', 'copperPlateS1', 'processingUnitS1', 'plasticBarS1', 'solidFuelS1', 'batteryS1', 'rocketFuelS1', 'rocketPartS1', 'redPackS1', 'greenPackS1', 'bluePackS1', 'purplePackS1', 'yellowPackS1' ], unlockTechs:[ 'steelTech', 'greenScience' ], },
]

var weaponData = [

    {	id:'pistol',            auto:false,     max:1,    time:5,	    costs:{ ironPlate:5, copperPlate:5 },                                                   fireTime:.25,   },
    {	id:'submachine',        auto:true,      max:1,    time:15,	    costs:{ ironPlate:30, copperPlate:5 },                                                  fireTime:.1,    },
    {	id:'shotgun',           auto:false,     max:1,    time:13,	    costs:{ ironPlate:10, copperPlate:25, wood:5 },                                         fireTime:1,     },
    {	id:'combatShotgun',     auto:true,      max:1,    time:13,	    costs:{ ironPlate:10, copperPlate:10, steelPlate:15, wood:10 },                         fireTime:.5,    },
    {	id:'rocketLauncher',    auto:false,     max:1,    time:19,	    costs:{ ironPlate:20, copperPlate:8 },                                                  fireTime:1,     },
    {	id:'artilleryTurret',   auto:false,     max:1,    time:250,	    costs:{ concrete:60, copperPlate:100, ironPlate:120, plasticBar:40, steelPlate:60 },    fireTime:4,     },
]

var ammunitionData = [

    {   id:'bullet',            icon:'bullet',              name:'bullet',              weaponIds:[ 'pistol', 'submachine' ],       desc:true,  damages:{ physical:5 },                     productionLevel:1,    time:1,	    outputs:{ bullet:10 },        inputs:{ ironPlate:4 }, },
    {   id:'piercing',          icon:'piercing',            name:'piercing',            weaponIds:[ 'pistol', 'submachine' ],       desc:true,  damages:{ physical:8 },                     productionLevel:1,    time:4,	    outputs:{ piercing:10 },      inputs:{ copperPlate:5, ironPlate:4, steelPlate:1 }, },
    {   id:'shotgunShell',      icon:'shotgunShell',        name:'shotgunShell',        weaponIds:[ 'shotgun', 'combatShotgun' ],   desc:true,  damages:{ physical:60 },                    productionLevel:1,    time:3,       outputs:{ shotgunShell:2 },   inputs:{ copperPlate:2, ironPlate:2 }, },
    {   id:'rocket',            icon:'rocket',              name:'rocket',              weaponIds:[ 'rocketLauncher' ],             desc:true,  damages:{ explosion:200 },                  productionLevel:1,    time:9,       outputs:{ rocket:1 },         inputs:{ copperPlate:2, explosive:1, ironPlate:3 }, },
    {   id:'artilleryShell',    icon:'artilleryShell',      name:'artilleryShell',      weaponIds:[ 'artilleryTurret' ],            desc:true,  damages:{ physical:500, explosion:500 },    productionLevel:1,    time:56,      outputs:{ artilleryShell:1 }, inputs:{ copperPlate:8, explosive:16, ironPlate:25, plasticBar:8, steelPlate:8 }, },
]

var alienData = [
    
    {   id:'biter1',    health:15,      shield:{ physical:0,  explosion:0  },  armor:{ physical:0,   explosion:0  },  eggCoeff:.9,  },
    {   id:'biter2',    health:75,      shield:{ physical:4,  explosion:0  },  armor:{ physical:.1,  explosion:.1 },  eggCoeff:.8,  },
    {   id:'biter3',    health:375,     shield:{ physical:8,  explosion:0  },  armor:{ physical:.1,  explosion:.1 },  eggCoeff:.7,  },
    {   id:'biter4',    health:3000,    shield:{ physical:12, explosion:12 },  armor:{ physical:.1,  explosion:.1 },  eggCoeff:.6,  },
]

//------------------------------------------------------------------------------

class Base {

    constructor(game, data) {
        
        this.game = game
        
        this.id = data.id
        
        this.count = 0
        this.unlocked = false
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
        this.outputs = data.outputs
        this.productionLevel = data.productionLevel
        
        this.auto = false
        this.state = 'paused'
        this.remainingSeconds = this.getTime()
        
        this.storages = []
        this.buildings = []
    }
    
    //---
    
    getMax() {
    
        let ret = 0
        
        for (let id in this.storages) {
            let storage = this.storages[id]
            
            ret += Math.floor(storage.storage * Math.pow(2.0, storage.count))
        }
        
        if (ret == 0) ret = this.max
        
        return ret
    }
    
    getBuildingsCount() {
    
        let ret = 0
        
        for (let id in this.buildings) {
            let building = this.buildings[id]
            
            ret += building.count
        }
        
        return ret
    }
    
    getTime() {
    
        let ret = this.time
        return ret
    }
    
    getInputs() {
        
        if (this.inputs == null) return null

        let bCount = Math.max(1, this.getBuildingsCount())
        
        let ret = {}
        
        for (let id in this.inputs) {
            let input = this.inputs[id]
            
            ret[id] = input * bCount
        }
        
        return ret
    }
    
    getOutputs() {
    
        let ret = {}
        
        let bCount = Math.max(1, this.getBuildingsCount())
        
        for (let id in this.outputs) {
            let output = this.outputs[id]
            
            ret[id] = output * bCount
        }
        
        return ret
    }
    
    canProduce() {
        
        if (this.productionLevel == 0) return false
        
        let outputs = this.getOutputs()
        for (let id in outputs) {
            let output = outputs[id]
            
            if (this.game.items[id].count >= this.game.items[id].getMax()) {            
                return false
            }
        }
        
        let inputs = this.getInputs()
        if (inputs == null) return true
        
        for (let id in inputs) {
            let input = inputs[id]
            
            if (input > this.game.items[id].count) {            
                return false
            }
        }
        
        return true
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
                    
                    this.game.items[id].count -= input
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
                    
                    this.game.items[id].count += input
                    if (this.game.items[id].count > this.game.items[id].getMax()) this.game.items[id].count = this.game.items[id].getMax()
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
        
        if (this.state == 'running') {
        
            let time = this.remainingSeconds - delta            
            if (time <= 0) {
                                
                let outputs = this.getOutputs()
                for (let id in outputs) {
                    let output = outputs[id]
                    
                    this.game.items[id].count += output
                    if (this.game.items[id].count > this.game.items[id].getMax()) this.game.items[id].count = this.game.items[id].getMax()
                    
                    this.game.items[id].onProduce()
                }
                
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
        
            this.game.items['stone'].unlocked = true
            this.game.items['ironPlate'].unlocked = true
            
            this.game.buildings['ironPlateT1'].unlocked = true
        }
    }
}

//------------------------------------------------------------------------------

class Buildable extends Base {

    constructor(game, data) {
        super(game, data)
        
        this.time = data.time
        this.costs = data.costs
        
        this.coeff = 1.12
        this.state = 'paused'
        this.remainingSeconds = this.getTime()
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
            
            if (cost > this.game.items[id].count) {            
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
        
        this.icon = data.icon
        this.name = data.name
        this.productionLevel = data.productionLevel
        
        if (data.itemId) {
        
            this.item = this.game.items[data.itemId]
            this.item.buildings.push(this)
        }
        
        if (data.ammoId) {
        
            this.item = this.game.ammunitions[data.ammoId]
            this.item.buildings.push(this)
        }
    }
    
    //---
    
    onBuild() {
        super.onBuild()
        
        if (this.id == 'ironPlateT1' && this.count >= 1) {
        
            this.game.buildings['ironT1'].unlocked = true
        }

        if (this.id == 'ironT1' && this.count >= 1) {
        
            this.game.buildings['stoneT1'].unlocked = true
        }
        
        if (this.id == 'stoneT1' && this.count >= 1) {
        
            this.game.items['copper'].unlocked = true
            this.game.items['copperPlate'].unlocked = true
            
            this.game.buildings['copperT1'].unlocked = true
            this.game.buildings['copperPlateT1'].unlocked = true
        }

        if (this.id == 'copperPlateT1' && this.count >= 1) {
        
            this.game.lab.unlocked = true
        }
        
        this.item.auto = true
        this.item.productionLevel = this.productionLevel
        
        if (this.item.getBuildingsCount() == 1) {
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
        
        if (data.itemId) {
        
            this.item = this.game.items[data.itemId]
            this.item.storages.push(this)
        }
        
        if (data.ammoId) {
        
            this.item = this.game.ammunitions[data.ammoId]
            this.item.storages.push(this)
        }
        
        this.coeff = 2
    }
}

//------------------------------------------------------------------------------

class Lab extends Buildable {

    constructor(game, data) {
        super(game, data)
        
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
        
        this.unlockTechs = data.unlockTechs
        this.unlockItems = data.unlockItems
        this.unlockStorages = data.unlockStorages
        this.unlockBuildings = data.unlockBuildings
        this.unlockWeapons = data.unlockWeapons
        this.unlockAmmunitions = data.unlockAmmunitions
        
        this.lab = this.game.lab
        this.lab.techs.push(this)
    }
    
    //---
    
    getTime() {
    
        let ret = super.getTime() / this.game.lab.count
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
        
        if (this.unlockTechs) this.unlockTechs.forEach(id => { this.game.techs[id].unlocked = true })
        if (this.unlockItems) this.unlockItems.forEach(id => { this.game.items[id].unlocked = true })
        if (this.unlockStorages) this.unlockStorages.forEach(id => { this.game.storages[id].unlocked = true })
        if (this.unlockBuildings) this.unlockBuildings.forEach(id => { this.game.buildings[id].unlocked = true })
        if (this.unlockWeapons) this.unlockWeapons.forEach(id => { this.game.weapons[id].unlocked = true })
        if (this.unlockAmmunitions) this.unlockAmmunitions.forEach(id => { this.game.ammunitions[id].unlocked = true })
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
            
            ret += ammunition.count
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
            
            if (ammunition.count > 0) {
            
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
                    
                    ammunition.count -= 1
                    
                    let kill = alien.doDamage(totalDamage)
                    if (kill > 0) {
                    
                        let dice = Math.random()
                        if (dice > alien.eggCoeff) {
                        
                            this.game.items['alienEgg'].count += 1
                            
                            if (this.game.currentMode == 'easy') this.stats.easyMode.totalAlienEggs += 1
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
        this.fireCount = data.fireCount
        
        for (let weaponId of data.weaponIds) {
        
            let weapon = this.game.weapons[weaponId]
            weapon.ammunitions.push(this)
        }
    }    
}

//------------------------------------------------------------------------------

class Alien {

    constructor(game, data) {
    
        this.id = data.id
        this.armor = data.armor
        this.shield = data.shield
        this.health = data.health
        this.eggCoeff = data.eggCoeff
        
        this.count = 0
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

class Game {

    constructor() {
        
        this.paused = false
        this.victory = false
        this.timePlayed = 0
        this.currentMode = 'easy'
        
        this.items = {}
        itemData.forEach(data => { this.items[data.id] = new Item(this, data) })
        
        this.weapons = {}
        weaponData.forEach(data => { this.weapons[data.id] = new Weapon(this, data) })
        
        this.ammunitions = {}
        ammunitionData.forEach(data => {
        
            let ammunition = new Ammunition(this, data)
            
            this.items[data.id] = ammunition
            this.ammunitions[data.id] = ammunition
        })
        
        this.buildings = {}
        buildingData.forEach(data => { this.buildings[data.id] = new Building(this, data) })
        
        this.storages = {}
        storageData.forEach(data => { this.storages[data.id] = new Storage(this, data) })
        
        this.lab = new Lab(this, labData)
        
        this.techs = {}
        techData.forEach(data => { this.techs[data.id] = new Tech(this, data) })
                       
        this.aliens = {}
        alienData.forEach(data => { this.aliens[data.id] = new Alien(this, data) })
        
        this.options = {
        
            researchedTechs: true,
        }
        
        this.stats = {
        
            easyMode: {
            
                totalTimePlayed:0,
                totalAlienEggs:0,
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
    
    //---
    
    initStartingData() {
    
        if (this.items['iron'].unlocked == false) this.items['iron'].unlocked = true
        
        if (this.currentMode == 'easy') {
        
            if (this.stats.easyMode.totalAlienEggs < this.items['alienEgg'].count) this.stats.easyMode.totalAlienEggs = this.items['alienEgg'].count            
        }
        
        this.checkTrophies()
    }    
    
    loadFromData(data) {
        
        if (data.paused != null) this.paused = data.paused
        if (data.victory != null) this.victory = data.victory
        if (data.timePlayed != null) this.timePlayed = data.timePlayed
        
        if (data.options != null) {
        
            if (data.options.researchedTechs != null) this.options.researchedTechs = data.options.researchedTechs
        }
        
        if (data.stats != null) {
        
            if (data.stats.easyMode.totalTimePlayed != null) this.stats.easyMode.totalTimePlayed = data.stats.easyMode.totalTimePlayed
            if (data.stats.easyMode.totalAlienEggs != null) this.stats.easyMode.totalAlienEggs = data.stats.easyMode.totalAlienEggs
        }
        
        if (data.trophies != null) {
        
            if (data.trophies.easyMode.win != null) this.trophies.easyMode.win = data.trophies.easyMode.win
            if (data.trophies.easyMode.oilProcessing != null) this.trophies.easyMode.win = data.trophies.easyMode.oilProcessing
            if (data.trophies.easyMode.allResearches != null) this.trophies.easyMode.allResearches = data.trophies.easyMode.allResearches
        }
        
        for (let id in data.items) {
            let dataItem = data.items[id]
            
            let item = this.items[id]
            if (item) {
            
                item.unlocked = dataItem.unlocked
                item.count = dataItem.count
                item.state = dataItem.state
                if (item.state == 'running') item.remainingSeconds = dataItem.remainingSeconds
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
                if (weapon.state == 'running') weapon.remainingSeconds = dataWeapon.remainingSeconds
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
            trophies: this.trophies,
            timePlayed: this.timePlayed,
            
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
            ammunitions: {},
        }
        
        for (let id in this.items) {
            let item = this.items[id]
            
            ret.items[item.id] = {
            
                unlocked: item.unlocked,
                count: item.count,
                state: item.state,
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
            }
        }
                
        for (let id in this.aliens) {
            let alien = this.aliens[id]
            
            ret.aliens[alien.id] = {
            
                count: alien.count,
                totalHealth: alien.totalHealth,
            }
        }
        
        return ret
    }
    
    generateAliens() {
    
        for (let id in this.aliens) {
            let alien = this.aliens[id]
            
            alien.setCount(Math.random() * 100)
        }
    }
    
    //---
    
    mainLoop(deltaTimeMs) {
        
        if (this.paused == false) {
        
            let delta = deltaTimeMs / 1000            
            
            let cycleCount = 1
            let cycleDelta = delta
            
            if (delta > 1) {
                
                cycleCount = Math.floor(delta) + 1
                cycleDelta = 1
            }
            
            this.timePlayed += cycleDelta * cycleCount
            
            if (this.currentMode == 'easy') this.stats.easyMode.totalTimePlayed = this.timePlayed
            
            for (let i = 0; i < cycleCount; i++) {    
                                
                for (let id in this.items) {
                    let item = this.items[id]
                    
                    item.produce(cycleDelta)
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
                weapon.fire(delta)
            }
        }
        
        this.checkTrophies()
    }
    
    isVictory() {
        
        let ret = false
        
        if (this.victory == false && this.items['rocketPart'].count >= 100) {
            ret = true
        }
        
        return ret
    }
    
    checkTrophies() {
    
        if (this.currentMode == 'easy') {
        
            if (this.victory == true) this.trophies.easyMode.win = true
            if (this.techs['oilTech1'].count >= 1) this.trophies.easyMode.oilProcessing = true
            if (this.getResearchedTechCount() >= techData.length) this.trophies.easyMode.allResearches = true
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
            popupVictory: null,            
            popupSupport: null,
            popupTutorial: null,
            
            //---
            
            tutorialEnabled: true,
            
            //---
            
            currentTabId: 'ironwork',
            
            currentIronworkPageId: 'iron',
            currentMasonryPageId: 'stone',
            currentElectronicPageId: 'copper',
            currentChemistryPageId: 'water',
            currentRocketPageId: 'rocketFuel',
            currentTechPageId: 'lab',
            currentWeaponsPageId: 'alienEgg',
            
            //---
            
            game: new Game(),
            
            //---
            
            tutorials: {
            
                tut0: { id:'tut0', done:false, check: function(app) { return false },                                           action: function(app) { app.setCurrentTabId('ironwork');    app.setCurrentIronworkPageId('iron'); }, },
                tut1: { id:'tut1', done:false, check: function(app) { return app.game.items['iron'].count >= 5 },               action: function(app) { app.setCurrentTabId('ironwork');    app.setCurrentIronworkPageId('iron'); }, },
                tut2: { id:'tut2', done:false, check: function(app) { return app.game.items['stone'].count >= 5 },              action: function(app) { app.setCurrentTabId('masonry');     app.setCurrentMasonryPageId('stone'); }, },
                tut3: { id:'tut3', done:false, check: function(app) { return app.game.buildings['ironPlateT1'].count >= 1 },    action: function(app) { app.setCurrentTabId('ironwork');    app.setCurrentIronworkPageId('ironPlate'); }, },
                tut4: { id:'tut4', done:false, check: function(app) { return app.game.buildings['ironT1'].count >= 1 },         action: function(app) { app.setCurrentTabId('ironwork');    app.setCurrentIronworkPageId('iron'); }, },
                tut5: { id:'tut5', done:false, check: function(app) { return app.game.buildings['stoneT1'].count >= 1 },        action: function(app) { app.setCurrentTabId('masonry');     app.setCurrentMasonryPageId('stone'); }, },
                tut6: { id:'tut6', done:false, check: function(app) { return app.game.buildings['copperPlateT1'].count >= 1 },  action: function(app) { app.setCurrentTabId('electronic');  app.setCurrentElectronicPageId('copper'); }, },
                tut7: { id:'tut7', done:false, check: function(app) { return app.game.lab.count >= 1 },                         action: function(app) { app.setCurrentTabId('techs');       app.setCurrentTechPageId('lab'); }, },
                tut8: { id:'tut8', done:false, check: function(app) { return app.game.techs['automation1'].count >= 1 },        action: function(app) { app.setCurrentTabId('techs');       app.setCurrentTechPageId('lab'); }, },
                tut9: { id:'tut9', done:false, check: function(app) { return false },                                           action: function(app) { app.setCurrentTabId('techs');       app.setCurrentTechPageId('redPack'); }, },
            },
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
        
        setCurrentIronworkPageId(pageId) { this.currentIronworkPageId = pageId },        
        setCurrentMasonryPageId(pageId) { this.currentMasonryPageId = pageId },
        setCurrentElectronicPageId(pageId) { this.currentElectronicPageId = pageId },
        setCurrentChemistryPageId(pageId) { this.currentChemistryPageId = pageId },
        setCurrentRocketPageId(pageId) { this.currentRocketPageId = pageId },
        setCurrentTechPageId(pageId) { this.currentTechPageId = pageId },
        setCurrentWeaponsPageId(pageId) { this.currentWeaponsPageId = pageId },
        
        //---
        
        gameItem(id) { return this.game.items[id] },
        gameWeapon(id) { return this.game.weapons[id] },
        gameAmmunition(id) { return this.game.ammunitions[id] },
        
        //---
        
        enableTutorial() {
        
            this.tutorialEnabled = true
            this.showPopupTutorial()
        },
        
        disableTutorial() {
        
            this.tutorialEnabled = false
        },
        
        processTutorial() {
        
            for (var tutId in this.tutorials) {
                if (this.tutorials[tutId].done == false) {
                    break
                }
            }
            
            let tut = this.tutorials[tutId]
            if (tut && tut.check(this) == true) {
                
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
        
            for (var tutId in this.tutorials) {
                if (this.tutorials[tutId].done == false) {
                    break
                }
            }
            
            let tut = this.tutorials[tutId]
            if (tut) {
            
                tut.action(this)
                this.popupTutorial = tut
            }
        },
        
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

                if (loadedData.currentIronworkPageId != null) this.currentIronworkPageId = loadedData.currentIronworkPageId
                if (loadedData.currentMasonryPageId != null) this.currentMasonryPageId = loadedData.currentMasonryPageId
                if (loadedData.currentElectronicPageId != null) this.currentElectronicPageId = loadedData.currentElectronicPageId
                if (loadedData.currentChemistryPageId != null) this.currentChemistryPageId = loadedData.currentChemistryPageId
                if (loadedData.currentRocketPageId != null) this.currentRocketPageId = loadedData.currentRocketPageId
                if (loadedData.currentTechPageId != null) this.currentTechPageId = loadedData.currentTechPageId
                if (loadedData.currentWeaponsPageId != null) this.currentWeaponsPageId = loadedData.currentWeaponsPageId
                
                if (loadedData.tutorials) {
                    for (var id in loadedData.tutorials) {
                        let dataTut = loadedData.tutorials[id]
                        
                        let tut = this.tutorials[id]
                        if (tut) {
                            tut.done = dataTut.done
                        }
                    }
                }
            }
        },

        save() {
            
            let savedData = this.game.getSavedData()
            
            savedData.lastFrameTimeMs = this.lastFrameTimeMs
            savedData.tutorialEnabled = this.tutorialEnabled
            
            savedData.currentTabId = this.currentTabId
            
            savedData.currentIronworkPageId = this.currentIronworkPageId
            savedData.currentMasonryPageId = this.currentMasonryPageId
            savedData.currentElectronicPageId = this.currentElectronicPageId
            savedData.currentChemistryPageId = this.currentChemistryPageId
            savedData.currentRocketPageId = this.currentRocketPageId
            savedData.currentTechPageId = this.currentTechPageId
            savedData.currentWeaponsPageId = this.currentWeaponsPageId
            
            savedData.tutorials = {}
            for (var id in this.tutorials) {
                savedData.tutorials[id] = { done: this.tutorials[id].done }
            }
                      
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
