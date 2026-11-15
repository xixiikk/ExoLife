from math import sqrt, isfinite

# Научные коэффициенты Interior ESI
RADIUS_WEIGHT = 0.57
DENSITY_WEIGHT = 1.07


def similarity(value, earth_value, weight):
    """Сходство одного параметра с Землёй."""
    if value is None or not isfinite(value) or value <= 0:
        return None

    ratio = abs((value - earth_value) / (value + earth_value))
    return (1 - ratio) ** weight


def calculate_interior_esi(radius, mass):
    """
    Interior ESI: индекс внутреннего сходства с Землёй.

    radius — радиус в радиусах Земли
    mass — масса в массах Земли
    """
    if radius is None or mass is None:
        return None

    if not isfinite(radius) or not isfinite(mass):
        return None

    if radius <= 0 or mass <= 0:
        return None

    # Плотность относительно земной:
    # rho/rho_earth = (M/M_earth) / (R/R_earth)^3
    relative_density = mass / (radius ** 3)

    radius_similarity = similarity(radius, 1.0, RADIUS_WEIGHT)
    density_similarity = similarity(
        relative_density, 1.0, DENSITY_WEIGHT
    )

    return round(
        sqrt(radius_similarity * density_similarity),
        4
    )


def build_ranking(planets, limit=50):
    """Предварительный рейтинг по Interior ESI."""
    ranking = []

    for planet in planets:
        radius = planet.get("pl_rade")
        mass = planet.get("pl_bmasse")
        mass_provenance = planet.get("pl_bmassprov")

        # Не используем минимальную массу M*sin(i) как полноценную массу планеты.
        if mass_provenance != "Mass":
            continue

        score = calculate_interior_esi(radius, mass)

        if score is None:
            continue

        ranking.append({
            "name": planet.get("pl_name"),
            "hostname": planet.get("hostname"),
            "radius": radius,
            "mass": mass,
            "equilibrium_temperature": planet.get("pl_eqt"),
            "insolation": planet.get("pl_insol"),
            "eccentricity": planet.get("pl_orbeccen"),
            "interior_esi": score,
        })

    ranking.sort(
        key=lambda planet: planet["interior_esi"],
        reverse=True
    )

    return ranking[:limit]