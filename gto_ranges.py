# Ranges de abertura pré-flop por posição (fonte: PioSolver/GTO+)
OPENING_RANGES = {
    "UTG": [
        "AA", "KK", "QQ", "JJ", "TT", "99", "88", "77",
        "AKs", "AQs", "AJs", "ATs", "A9s", "A8s",
        "AKo", "AQo", "AJo",
        "KQs", "KJs", "KTs",
        "QJs", "QTs",
        "JTs"
    ],
    "MP": [
        "AA", "KK", "QQ", "JJ", "TT", "99", "88", "77", "66",
        "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s",
        "AKo", "AQo", "AJo", "ATo",
        "KQs", "KJs", "KTs", "K9s",
        "QJs", "QTs", "Q9s",
        "JTs", "J9s",
        "T9s"
    ],
    "CO": [
        "AA", "KK", "QQ", "JJ", "TT", "99", "88", "77", "66", "55",
        "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s",
        "AKo", "AQo", "AJo", "ATo", "A9o",
        "KQs", "KJs", "KTs", "K9s", "K8s", "K7s",
        "KQo", "KJo", "KTo",
        "QJs", "QTs", "Q9s", "Q8s",
        "QJo", "QTo",
        "JTs", "J9s", "J8s",
        "JTo",
        "T9s", "T8s",
        "98s", "87s", "76s", "65s"
    ],
    "BTN": [
        "AA", "KK", "QQ", "JJ", "TT", "99", "88", "77", "66", "55", "44", "33", "22",
        "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s",
        "AKo", "AQo", "AJo", "ATo", "A9o", "A8o", "A7o", "A6o", "A5o",
        "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s",
        "KQo", "KJo", "KTo", "K9o",
        "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s",
        "QJo", "QTo", "Q9o",
        "JTs", "J9s", "J8s", "J7s",
        "JTo", "J9o",
        "T9s", "T8s", "T7s",
        "T9o",
        "98s", "97s", "87s", "76s", "65s", "54s"
    ],
    "SB": [
        "AA", "KK", "QQ", "JJ", "TT", "99", "88", "77", "66", "55", "44",
        "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s",
        "AKo", "AQo", "AJo", "ATo", "A9o",
        "KQs", "KJs", "KTs", "K9s", "K8s",
        "KQo", "KJo", "KTo",
        "QJs", "QTs", "Q9s",
        "QJo", "QTo",
        "JTs", "J9s",
        "T9s",
        "98s", "87s", "76s"
    ],
    "BB": [
        "AA", "KK", "QQ", "JJ", "TT", "99", "88", "77", "66", "55", "44", "33", "22",
        "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s",
        "AKo", "AQo", "AJo", "ATo", "A9o", "A8o", "A7o",
        "KQs", "KJs", "KTs", "K9s", "K8s", "K7s",
        "KQo", "KJo", "KTo", "K9o",
        "QJs", "QTs", "Q9s", "Q8s",
        "QJo", "QTo", "Q9o",
        "JTs", "J9s", "J8s",
        "JTo", "J9o",
        "T9s", "T8s",
        "98s", "87s", "76s", "65s"
    ]
}

# Ranges de 3-bet por posição
THREEB_RANGES = {
    "vs_UTG_raise": [
        "AA", "KK", "QQ", "JJ",
        "AKs", "AQs", "AJs",
        "AKo", "AQo",
        "KQs"
    ],
    "vs_MP_raise": [
        "AA", "KK", "QQ", "JJ", "TT",
        "AKs", "AQs", "AJs", "ATs",
        "AKo", "AQo", "AJo",
        "KQs", "KJs"
    ],
    "vs_CO_raise": [
        "AA", "KK", "QQ", "JJ", "TT", "99",
        "AKs", "AQs", "AJs", "ATs", "A9s",
        "AKo", "AQo", "AJo", "ATo",
        "KQs", "KJs", "KTs",
        "QJs"
    ],
    "vs_BTN_raise": [
        "AA", "KK", "QQ", "JJ", "TT", "99", "88",
        "AKs", "AQs", "AJs", "ATs", "A9s", "A8s",
        "AKo", "AQo", "AJo", "ATo", "A9o",
        "KQs", "KJs", "KTs", "K9s",
        "KQo", "KJo",
        "QJs", "QTs"
    ],
    "vs_SB_raise": [
        "AA", "KK", "QQ", "JJ", "TT", "99", "88", "77",
        "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s",
        "AKo", "AQo", "AJo", "ATo", "A9o",
        "KQs", "KJs", "KTs", "K9s", "K8s",
        "KQo", "KJo", "KTo",
        "QJs", "QTs", "Q9s"
    ]
}

# Força relativa das mãos (1-10)
HAND_STRENGTH = {
    'AA': 10.0, 'KK': 9.5, 'QQ': 9.0, 'JJ': 8.5, 'TT': 8.0,
    '99': 7.5, '88': 7.0, '77': 6.5, '66': 6.0, '55': 5.5,
    '44': 5.0, '33': 4.5, '22': 4.0,
    'AKs': 8.5, 'AQs': 8.0, 'AJs': 7.8, 'ATs': 7.5, 'A9s': 7.0, 'A8s': 6.8,
    'A7s': 6.5, 'A6s': 6.3, 'A5s': 6.8, 'A4s': 6.5, 'A3s': 6.3, 'A2s': 6.0,
    'AKo': 8.0, 'AQo': 7.5, 'AJo': 7.3, 'ATo': 7.0, 'A9o': 6.5, 'A8o': 6.0,
    'KQs': 7.5, 'KJs': 7.3, 'KTs': 7.0, 'K9s': 6.5, 'K8s': 6.0,
    'KQo': 7.0, 'KJo': 6.8, 'KTo': 6.5, 'K9o': 6.0,
    'QJs': 7.0, 'QTs': 6.8, 'Q9s': 6.5, 'Q8s': 6.0,
    'QJo': 6.5, 'QTo': 6.3, 'Q9o': 5.8,
    'JTs': 6.8, 'J9s': 6.3, 'J8s': 6.0,
    'JTo': 6.3, 'J9o': 5.8,
    'T9s': 6.3, 'T8s': 6.0,
    '98s': 6.0, '87s': 5.8, '76s': 5.5, '65s': 5.3, '54s': 5.0
}

def get_hand_strength(hand):
    """Retorna a força relativa de uma mão."""
    return HAND_STRENGTH.get(hand, 5.0)  # Default 5.0 para mãos não listadas

def should_open(hand, position):
    """Determina se deve abrir com uma mão em determinada posição."""
    return hand in OPENING_RANGES.get(position, [])

def should_threebet(hand, position):
    """Determina se deve 3-bet com uma mão em determinada posição."""
    return hand in THREEB_RANGES.get(f"vs_{position}_raise", [])