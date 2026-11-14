from math import isfinite

# Модель Kopparapu et al. (2014)
# Консервативная зона обитаемости для планеты массой 1 M_earth.
# Диапазон температур звёзд: 2600–7200 K.

INNER_EDGE = (
    1.107,
    1.332e-4,
    1.580e-8,
    -8.308e-12,
    -1.931e-15,
)

OUTER_EDGE = (
    0.356,
    6.171e-5,
    1.698e-9,
    -3.198e-12,
    -5.575e-16,
)


def valid_positive(value):
    return (
        isinstance(value, (int, float))
        and not isinstance(value, bool)
        and isfinite(value)
        and value > 0
    )


def stellar_flux_boundary(temperature, coefficients):
    """Граница зоны в единицах земного потока."""
    delta_t = temperature - 5780.0
    s, a, b, c, d = coefficients

    return (
        s
        + a * delta_t
        + b * delta_t**2
        + c * delta_t**3
        + d * delta_t**4
    )


def calculate_habitable_zone(insolation, stellar_temperature):
    """
    insolation: поток на планете в единицах земного.
    stellar_temperature: температура звезды, K.

    Возвращает предварительную классификацию.
    """
    result = {
        "status": "unknown",
        "label": "Недостаточно данных",
        "inner_flux": None,
        "outer_flux": None,
    }

    if not valid_positive(insolation):
        return result

    if not valid_positive(stellar_temperature):
        return result

    if not 2600 <= stellar_temperature <= 7200:
        return {
            **result,
            "label": "Температура звезды вне области модели",
        }

    inner = stellar_flux_boundary(
        stellar_temperature, INNER_EDGE
    )
    outer = stellar_flux_boundary(
        stellar_temperature, OUTER_EDGE
    )

    if outer <= 0 or inner <= outer:
        return result

    if insolation > inner:
        status = "too_hot"
        label = "Внутри горячей границы"
    elif insolation < outer:
        status = "too_cold"
        label = "За холодной границей"
    else:
        status = "in_zone"
        label = "В зоне обитаемости"

    return {
        "status": status,
        "label": label,
        "inner_flux": round(inner, 4),
        "outer_flux": round(outer, 4),
    }


def analyze_habitable_zones(planets):
    """Классификация всех планет по данным NASA."""
    results = []

    for planet in planets:
        zone = calculate_habitable_zone(
            planet.get("pl_insol"),
            planet.get("st_teff"),
        )

        results.append({
            "name": planet.get("pl_name"),
            "hostname": planet.get("hostname"),
            "radius": planet.get("pl_rade"),
            "mass": planet.get("pl_bmasse"),
            "insolation": planet.get("pl_insol"),
            "stellar_temperature": planet.get("st_teff"),
            "eccentricity": planet.get("pl_orbeccen"),
            **zone,
        })

    return results