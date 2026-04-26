<template>
    <ion-modal ref="modalRef" :is-open="isOpen" @didDismiss="$emit('close')" :initial-breakpoint="0.85"
        :breakpoints="[0, 0.85]" handle="false" class="emoji-sheet">
        <ion-content class="sheet-content">
            <div class="sheet-wrapper">
                <!-- Handle -->
                <div class="sheet-handle" />

                <div class="sheet-title">Choose Emoji for Pocket</div>

                <!-- Search -->
                <div class="search-wrapper">
                    <input v-model="search" type="text" placeholder="Search...." class="search-input" @touchstart.stop
                        @mousedown.stop />
                    <ion-icon :icon="searchOutline" class="search-icon" />
                </div>

                <!-- Emoji List -->
                <div class="emoji-scroll">
                    <div v-for="category in filteredCategories" :key="category.name">
                        <div class="category-label">{{ category.name }}</div>
                        <div class="emoji-grid">
                            <span v-for="emoji in category.emojis" :key="emoji" class="emoji-item"
                                @click="selectEmoji(emoji)">
                                {{ emoji }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </ion-content>
    </ion-modal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { IonModal, IonContent, IonIcon } from '@ionic/vue'
import { searchOutline } from 'ionicons/icons'
import { createGesture } from '@ionic/vue'

defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close', 'select'])

const search = ref('')
const handleRef = ref()

onMounted(() => {
    const el = handleRef.value
    if (!el) return

    let startY = 0

    const gesture = createGesture({
        el,
        gestureName: 'swipe-down-handle',
        direction: 'y',
        onStart: (detail) => {
            startY = detail.startY
        },
        onEnd: (detail) => {
            const delta = detail.currentY - startY
            if (delta > 60) {
                emit('close')
            }
        },
    })
    gesture.enable()
})

const categories = [
    {
        name: 'SMILEY AND PEOPLE',
        emojis: [
            { char: '😀', keywords: 'grinning happy smile' },
            { char: '😃', keywords: 'happy smile big eyes' },
            { char: '😄', keywords: 'happy smile laugh' },
            { char: '😁', keywords: 'grin happy beam' },
            { char: '😆', keywords: 'laugh happy xd' },
            { char: '🤩', keywords: 'star eyes wow amazing' },
            { char: '😂', keywords: 'laugh cry tears funny' },
            { char: '🙂', keywords: 'slightly smile' },
            { char: '😊', keywords: 'smile happy blush' },
            { char: '😇', keywords: 'angel innocent halo' },
            { char: '🥰', keywords: 'love hearts smiling' },
            { char: '😍', keywords: 'heart eyes love' },
            { char: '😈', keywords: 'devil evil smiling' },
            { char: '😎', keywords: 'cool sunglasses' },
            { char: '🥲', keywords: 'smile tear sad happy' },
            { char: '🤪', keywords: 'crazy zany wacky' },
            { char: '😘', keywords: 'kiss love heart' },
            { char: '😏', keywords: 'smirk sly' },
            { char: '😒', keywords: 'unamused unhappy' },
            { char: '😞', keywords: 'disappointed sad' },
            { char: '😔', keywords: 'pensive sad' },
            { char: '😟', keywords: 'worried sad' },
            { char: '😕', keywords: 'confused sad' },
            { char: '🙁', keywords: 'sad frown' },
            { char: '☹️', keywords: 'frowning sad' },
            { char: '😣', keywords: 'persevere struggling' },
            { char: '😖', keywords: 'confounded stressed' },
            { char: '😫', keywords: 'tired weary' },
            { char: '😩', keywords: 'weary tired' },
            { char: '🥺', keywords: 'pleading puppy eyes sad' },
            { char: '😢', keywords: 'cry sad tear' },
            { char: '😭', keywords: 'sob crying loud' },
            { char: '😤', keywords: 'triumph steam mad' },
            { char: '😠', keywords: 'angry mad' },
            { char: '😡', keywords: 'rage angry red' },
            { char: '🤬', keywords: 'swearing cursing angry' },
            { char: '🤯', keywords: 'mind blown explode' },
            { char: '😳', keywords: 'flushed embarrassed' },
            { char: '🥵', keywords: 'hot sweating overheated' },
            { char: '🥶', keywords: 'cold freezing blue' },
            { char: '😱', keywords: 'scream shocked horror' },
            { char: '😨', keywords: 'fearful scared' },
            { char: '😰', keywords: 'anxious sweat nervous' },
            { char: '😥', keywords: 'sad relieved sweat' },
            { char: '😓', keywords: 'downcast sweat' },
            { char: '🤗', keywords: 'hug happy hands' },
            { char: '🤔', keywords: 'thinking hmm' },
            { char: '🫣', keywords: 'peek eye shy' },
            { char: '🤭', keywords: 'giggle oops hand mouth' },
            { char: '🫡', keywords: 'salute respect' },
            { char: '🤫', keywords: 'shush quiet secret' },
            { char: '🫠', keywords: 'melt melting' },
            { char: '🙄', keywords: 'eye roll whatever' },
            { char: '😬', keywords: 'grimace awkward' },
            { char: '🤥', keywords: 'lying pinocchio' },
            { char: '😌', keywords: 'relieved peaceful' },
            { char: '😪', keywords: 'sleepy tired' },
            { char: '🤤', keywords: 'drool hungry' },
            { char: '😴', keywords: 'sleep zzz' },
            { char: '🤢', keywords: 'nauseated sick' },
            { char: '🤮', keywords: 'vomit sick' },
            { char: '🤧', keywords: 'sneeze sick cold' },
            { char: '🥴', keywords: 'woozy drunk dizzy' },
            { char: '😵', keywords: 'dizzy dead spiral' },
            { char: '🤠', keywords: 'cowboy hat' },
            { char: '🥸', keywords: 'disguise glasses' },
            { char: '🤡', keywords: 'clown joker' },
            { char: '👹', keywords: 'ogre monster japanese' },
            { char: '💀', keywords: 'skull dead bones' },
            { char: '👻', keywords: 'ghost boo' },
            { char: '👽', keywords: 'alien ufo' },
            { char: '🤖', keywords: 'robot bot' },
        ],
    },
    {
        name: 'ANIMALS AND NATURE',
        emojis: [
            { char: '🐶', keywords: 'dog puppy pet' },
            { char: '🐱', keywords: 'cat kitten pet' },
            { char: '🐭', keywords: 'mouse rodent' },
            { char: '🐹', keywords: 'hamster pet' },
            { char: '🐰', keywords: 'rabbit bunny' },
            { char: '🦊', keywords: 'fox animal' },
            { char: '🐻', keywords: 'bear animal' },
            { char: '🐼', keywords: 'panda bear' },
            { char: '🐨', keywords: 'koala australia' },
            { char: '🐯', keywords: 'tiger animal' },
            { char: '🦁', keywords: 'lion animal king' },
            { char: '🐮', keywords: 'cow animal farm' },
            { char: '🐷', keywords: 'pig animal farm' },
            { char: '🐸', keywords: 'frog green' },
            { char: '🐵', keywords: 'monkey animal' },
            { char: '🐔', keywords: 'chicken bird farm' },
            { char: '🐧', keywords: 'penguin bird' },
            { char: '🐦', keywords: 'bird flying' },
            { char: '🦆', keywords: 'duck bird water' },
            { char: '🦅', keywords: 'eagle bird' },
            { char: '🦉', keywords: 'owl bird night' },
            { char: '🦇', keywords: 'bat animal night' },
            { char: '🐺', keywords: 'wolf animal' },
            { char: '🐗', keywords: 'boar pig wild' },
            { char: '🐴', keywords: 'horse animal' },
            { char: '🦄', keywords: 'unicorn magic horse' },
            { char: '🐝', keywords: 'bee honey insect' },
            { char: '🦋', keywords: 'butterfly insect' },
            { char: '🐌', keywords: 'snail slow' },
            { char: '🐞', keywords: 'ladybug insect' },
            { char: '🐜', keywords: 'ant insect' },
            { char: '🦎', keywords: 'lizard reptile' },
            { char: '🐍', keywords: 'snake reptile' },
            { char: '🐢', keywords: 'turtle slow' },
            { char: '🐙', keywords: 'octopus sea' },
            { char: '🦑', keywords: 'squid sea' },
            { char: '🦀', keywords: 'crab sea' },
            { char: '🐟', keywords: 'fish sea' },
            { char: '🐬', keywords: 'dolphin sea' },
            { char: '🐳', keywords: 'whale sea big' },
            { char: '🦈', keywords: 'shark sea danger' },
            { char: '🐘', keywords: 'elephant big' },
            { char: '🦒', keywords: 'giraffe tall' },
            { char: '🦓', keywords: 'zebra stripes' },
            { char: '🦍', keywords: 'gorilla ape' },
            { char: '🐕', keywords: 'dog pet' },
            { char: '🐈', keywords: 'cat pet' },
            { char: '🐇', keywords: 'rabbit bunny' },
            { char: '🦔', keywords: 'hedgehog spiky' },
        ],
    },
    {
        name: 'FOOD AND DRINK',
        emojis: [
            { char: '🍎', keywords: 'apple fruit red' },
            { char: '🍐', keywords: 'pear fruit' },
            { char: '🍊', keywords: 'orange fruit' },
            { char: '🍋', keywords: 'lemon fruit sour' },
            { char: '🍌', keywords: 'banana fruit yellow' },
            { char: '🍉', keywords: 'watermelon fruit summer' },
            { char: '🍇', keywords: 'grapes fruit' },
            { char: '🍓', keywords: 'strawberry fruit' },
            { char: '🫐', keywords: 'blueberry fruit' },
            { char: '🍒', keywords: 'cherry fruit' },
            { char: '🍑', keywords: 'peach fruit' },
            { char: '🥭', keywords: 'mango fruit tropical' },
            { char: '🍍', keywords: 'pineapple fruit tropical' },
            { char: '🥥', keywords: 'coconut fruit tropical' },
            { char: '🥑', keywords: 'avocado fruit' },
            { char: '🍆', keywords: 'eggplant vegetable' },
            { char: '🥦', keywords: 'broccoli vegetable' },
            { char: '🌽', keywords: 'corn vegetable' },
            { char: '🌶️', keywords: 'chili spicy hot' },
            { char: '🧄', keywords: 'garlic vegetable' },
            { char: '🧅', keywords: 'onion vegetable' },
            { char: '🥔', keywords: 'potato vegetable' },
            { char: '🍳', keywords: 'egg fry cooking' },
            { char: '🧀', keywords: 'cheese food' },
            { char: '🥩', keywords: 'meat steak food' },
            { char: '🍗', keywords: 'chicken drumstick food' },
            { char: '🍔', keywords: 'burger hamburger food' },
            { char: '🍟', keywords: 'fries chips food' },
            { char: '🍕', keywords: 'pizza food' },
            { char: '🌮', keywords: 'taco mexican food' },
            { char: '🌯', keywords: 'burrito wrap food' },
            { char: '🍝', keywords: 'pasta spaghetti food' },
            { char: '🍜', keywords: 'noodle ramen food' },
            { char: '🍲', keywords: 'stew pot food' },
            { char: '🍛', keywords: 'curry rice food' },
            { char: '🍣', keywords: 'sushi japanese food' },
            { char: '🥟', keywords: 'dumpling food' },
            { char: '🍤', keywords: 'shrimp fried food' },
            { char: '🍙', keywords: 'rice ball food' },
            { char: '🧁', keywords: 'cupcake dessert sweet' },
            { char: '🍰', keywords: 'cake dessert sweet' },
            { char: '🎂', keywords: 'birthday cake' },
            { char: '🍩', keywords: 'donut dessert sweet' },
            { char: '🍪', keywords: 'cookie dessert sweet' },
            { char: '🍫', keywords: 'chocolate dessert' },
            { char: '🍬', keywords: 'candy sweet' },
            { char: '🍭', keywords: 'lollipop candy sweet' },
            { char: '🍿', keywords: 'popcorn snack movie' },
            { char: '🥤', keywords: 'drink cup juice' },
            { char: '🧋', keywords: 'boba bubble tea drink' },
            { char: '☕', keywords: 'coffee hot drink' },
            { char: '🍵', keywords: 'tea hot drink' },
            { char: '🍺', keywords: 'beer drink alcohol' },
            { char: '🍷', keywords: 'wine drink alcohol' },
            { char: '🍸', keywords: 'cocktail drink alcohol' },
            { char: '🍹', keywords: 'tropical drink juice' },
            { char: '🧊', keywords: 'ice cold' },
            { char: '🍯', keywords: 'honey jar sweet' },
        ],
    },
    {
        name: 'TRAVEL AND PLACES',
        emojis: [
            { char: '🚗', keywords: 'car vehicle drive' },
            { char: '🚕', keywords: 'taxi cab vehicle' },
            { char: '🚙', keywords: 'suv car vehicle' },
            { char: '🚌', keywords: 'bus transport' },
            { char: '🏎️', keywords: 'race car fast' },
            { char: '🚓', keywords: 'police car' },
            { char: '🚑', keywords: 'ambulance emergency' },
            { char: '🚒', keywords: 'fire truck emergency' },
            { char: '🚜', keywords: 'tractor farm' },
            { char: '🏍️', keywords: 'motorcycle bike' },
            { char: '🛵', keywords: 'scooter motor' },
            { char: '🚲', keywords: 'bicycle bike' },
            { char: '🚁', keywords: 'helicopter fly' },
            { char: '✈️', keywords: 'airplane plane fly travel' },
            { char: '🚀', keywords: 'rocket space launch' },
            { char: '🛸', keywords: 'ufo alien space' },
            { char: '⛵', keywords: 'sailboat sea' },
            { char: '🚢', keywords: 'ship cruise sea' },
            { char: '⛽', keywords: 'gas fuel petrol' },
            { char: '🗺️', keywords: 'map travel world' },
            { char: '🗼', keywords: 'tower eiffel paris' },
            { char: '🗽', keywords: 'statue liberty usa' },
            { char: '🏔️', keywords: 'mountain snow peak' },
            { char: '🌋', keywords: 'volcano eruption mountain' },
            { char: '🏕️', keywords: 'camping tent outdoor' },
            { char: '🏖️', keywords: 'beach sand sea' },
            { char: '🏜️', keywords: 'desert sand hot' },
            { char: '🏝️', keywords: 'island tropical sea' },
            { char: '🏠', keywords: 'house home building' },
            { char: '🏢', keywords: 'office building city' },
            { char: '🏥', keywords: 'hospital medical building' },
            { char: '🏦', keywords: 'bank money building' },
            { char: '🏪', keywords: 'store shop building' },
            { char: '🏫', keywords: 'school building' },
            { char: '🏰', keywords: 'castle palace' },
            { char: '🌃', keywords: 'night city stars' },
            { char: '🌆', keywords: 'city sunset buildings' },
            { char: '🌉', keywords: 'bridge night city' },
        ],
    },
    {
        name: 'ACTIVITIES',
        emojis: [
            { char: '⚽', keywords: 'soccer football sport' },
            { char: '🏀', keywords: 'basketball sport' },
            { char: '🏈', keywords: 'football american sport' },
            { char: '⚾', keywords: 'baseball sport' },
            { char: '🎾', keywords: 'tennis sport' },
            { char: '🏐', keywords: 'volleyball sport' },
            { char: '🏉', keywords: 'rugby sport' },
            { char: '🎱', keywords: 'billiard pool sport' },
            { char: '🏓', keywords: 'pingpong table tennis sport' },
            { char: '🏸', keywords: 'badminton sport' },
            { char: '🥅', keywords: 'goal net sport' },
            { char: '⛳', keywords: 'golf sport hole' },
            { char: '🎿', keywords: 'ski winter sport' },
            { char: '🛷', keywords: 'sled winter sport' },
            { char: '🎯', keywords: 'target dart aim' },
            { char: '🎮', keywords: 'game controller video' },
            { char: '🎲', keywords: 'dice game board' },
            { char: '🧩', keywords: 'puzzle piece game' },
            { char: '🎭', keywords: 'theater art drama' },
            { char: '🎨', keywords: 'art paint palette' },
            { char: '🎤', keywords: 'microphone sing music' },
            { char: '🎧', keywords: 'headphone music listen' },
            { char: '🎼', keywords: 'music note sheet' },
            { char: '🎹', keywords: 'piano keyboard music' },
            { char: '🥁', keywords: 'drum music beat' },
            { char: '🎷', keywords: 'saxophone music jazz' },
            { char: '🎺', keywords: 'trumpet music' },
            { char: '🎸', keywords: 'guitar music rock' },
            { char: '🎻', keywords: 'violin music' },
            { char: '🎬', keywords: 'movie film clapper' },
            { char: '🎥', keywords: 'camera movie film' },
            { char: '📷', keywords: 'camera photo' },
            { char: '🔭', keywords: 'telescope space star' },
            { char: '🔬', keywords: 'microscope science lab' },
        ],
    },
    {
        name: 'OBJECTS',
        emojis: [
            { char: '💡', keywords: 'light bulb idea' },
            { char: '🔦', keywords: 'flashlight torch' },
            { char: '💰', keywords: 'money bag rich' },
            { char: '💳', keywords: 'credit card payment' },
            { char: '💎', keywords: 'diamond gem rich' },
            { char: '⚖️', keywords: 'scale balance law' },
            { char: '🔧', keywords: 'wrench tool fix' },
            { char: '🔨', keywords: 'hammer tool' },
            { char: '🛠️', keywords: 'tools fix build' },
            { char: '🔩', keywords: 'bolt screw tool' },
            { char: '🧲', keywords: 'magnet attract' },
            { char: '💊', keywords: 'pill medicine health' },
            { char: '🩺', keywords: 'stethoscope doctor health' },
            { char: '🧬', keywords: 'dna science biology' },
            { char: '📡', keywords: 'satellite antenna signal' },
            { char: '💻', keywords: 'laptop computer tech' },
            { char: '⌨️', keywords: 'keyboard computer type' },
            { char: '🖥️', keywords: 'desktop computer monitor' },
            { char: '📱', keywords: 'phone mobile smartphone' },
            { char: '☎️', keywords: 'telephone phone call' },
            { char: '📺', keywords: 'tv television screen' },
            { char: '📻', keywords: 'radio music broadcast' },
            { char: '⏰', keywords: 'alarm clock time' },
            { char: '⌚', keywords: 'watch time wrist' },
            { char: '📦', keywords: 'box package delivery' },
            { char: '📫', keywords: 'mailbox letter post' },
            { char: '🔔', keywords: 'bell notification alert' },
            { char: '🎵', keywords: 'music note song' },
            { char: '🎶', keywords: 'music notes song' },
            { char: '📚', keywords: 'books reading study' },
            { char: '📖', keywords: 'book open reading' },
            { char: '📝', keywords: 'memo note write' },
            { char: '✏️', keywords: 'pencil write draw' },
            { char: '📌', keywords: 'pin location mark' },
            { char: '📍', keywords: 'pin location mark' },
            { char: '✂️', keywords: 'scissors cut' },
            { char: '🔒', keywords: 'lock secure locked' },
            { char: '🔓', keywords: 'unlock open' },
            { char: '🔑', keywords: 'key unlock access' },
            { char: '🧺', keywords: 'basket laundry' },
            { char: '🛒', keywords: 'cart shopping' },
            { char: '🎁', keywords: 'gift present box' },
            { char: '🎀', keywords: 'ribbon bow gift' },
            { char: '🎊', keywords: 'confetti party celebrate' },
            { char: '🎉', keywords: 'party celebrate tada' },
            { char: '🎈', keywords: 'balloon party celebrate' },
            { char: '🪄', keywords: 'magic wand spell' },
            { char: '🎩', keywords: 'hat top magic' },
        ],
    },
    {
        name: 'SYMBOLS',
        emojis: [
            { char: '❤️', keywords: 'heart love red' },
            { char: '🧡', keywords: 'heart orange love' },
            { char: '💛', keywords: 'heart yellow love' },
            { char: '💚', keywords: 'heart green love' },
            { char: '💙', keywords: 'heart blue love' },
            { char: '💜', keywords: 'heart purple love' },
            { char: '🖤', keywords: 'heart black love' },
            { char: '🤍', keywords: 'heart white love' },
            { char: '💔', keywords: 'broken heart sad love' },
            { char: '❣️', keywords: 'heart exclamation love' },
            { char: '💕', keywords: 'two hearts love' },
            { char: '💞', keywords: 'revolving hearts love' },
            { char: '💓', keywords: 'beating heart love' },
            { char: '💗', keywords: 'growing heart love' },
            { char: '💖', keywords: 'sparkling heart love' },
            { char: '💘', keywords: 'heart arrow love cupid' },
            { char: '💝', keywords: 'heart ribbon love gift' },
            { char: '☮️', keywords: 'peace sign symbol' },
            { char: '♻️', keywords: 'recycle green environment' },
            { char: '✅', keywords: 'check mark done yes' },
            { char: '❌', keywords: 'cross no cancel' },
            { char: '⭕', keywords: 'circle red mark' },
            { char: '🛑', keywords: 'stop sign red' },
            { char: '⚠️', keywords: 'warning caution danger' },
            { char: '🚧', keywords: 'construction warning' },
            { char: '💯', keywords: 'hundred percent perfect score' },
            { char: '🔁', keywords: 'repeat loop' },
            { char: '🔀', keywords: 'shuffle random' },
            { char: '🔊', keywords: 'speaker loud volume' },
            { char: '🔇', keywords: 'mute silent no sound' },
            { char: '💤', keywords: 'sleep zzz tired' },
            { char: '🔥', keywords: 'fire hot flame' },
            { char: '⭐', keywords: 'star favorite' },
            { char: '🌟', keywords: 'star glowing bright' },
            { char: '💫', keywords: 'star dizzy spin' },
            { char: '✨', keywords: 'sparkles magic shine' },
            { char: '🎯', keywords: 'target bullseye aim' },
            { char: '🏆', keywords: 'trophy win champion' },
            { char: '🥇', keywords: 'gold medal first win' },
            { char: '🎖️', keywords: 'medal military honor' },
        ],
    },
]

const filteredCategories = computed(() => {
    if (!search.value) return categories.map(cat => ({
        name: cat.name,
        emojis: cat.emojis.map(e => e.char),
    }))

    const q = search.value.toLowerCase()
    return categories
        .map(cat => ({
            name: cat.name,
            emojis: cat.emojis
                .filter(e => e.keywords.includes(q) || e.char.includes(q) || cat.name.toLowerCase().includes(q))
                .map(e => e.char),
        }))
        .filter(cat => cat.emojis.length > 0)
})

const selectEmoji = (emoji: string) => {
    emit('select', emoji)
    emit('close')
}
</script>

<style scoped>
.emoji-sheet {
    --border-radius: 24px 24px 0 0;
}

.sheet-content {
    --background: var(--color-white);
}

.sheet-wrapper {
    display: flex;
    flex-direction: column;
    padding: 12px 16px 110px;
    height: 100%;
}

.sheet-handle {
    width: 49px;
    height: 5px;
    background: var(--color-black-40);
    border-radius: 5px;
    margin: 8px auto 16px;
}

.sheet-title {
    font-size: 20px;
    font-weight: 700;
    line-height: 32px;
    letter-spacing: -0.02em;
    color: var(--color-black-100);
    margin-bottom: 16px;
}

/* Search */
.search-wrapper {
    display: flex;
    align-items: center;
    background: var(--color-bg-3);
    border-radius: 8px;
    padding: 0 14px;
    height: 48px;
    margin-bottom: 16px;
    gap: 8px;
}

.search-input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 16px;
    font-weight: 400;
    color: var(--color-black-100);
    padding: 12px 0;
    outline: none;
    font-family: inherit;
}

.search-input::placeholder {
    color: var(--color-black-60);
}

.search-icon {
    font-size: 20px;
    color: var(--color-black-100);
    flex-shrink: 0;
}

/* Emoji Scroll */
.emoji-scroll {
    flex: 1;
    overflow-y: auto;
    scrollbar-width: none;
}

.emoji-scroll::-webkit-scrollbar {
    display: none;
}

.category-label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 16px;
    color: var(--color-black-60);
    margin-bottom: 8px;
    margin-top: 12px;
}

.emoji-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 4px;
}

.emoji-item {
    font-size: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 8px;
    cursor: pointer;
    aspect-ratio: 1;
    transition: background 0.15s;
}

.emoji-item:active {
    background: var(--color-bg-3);
}
</style>

<style>
.emoji-sheet {
    --width: 100% !important;
    --max-width: 480px !important;
    --border-radius: 24px 24px 0 0 !important;
}
</style>