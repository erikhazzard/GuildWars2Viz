''' =========================================================================
    cards_xml_to_json

    This file will read in a cards.xml file (e.g., from Cockatrice) and convert
        it to a JSON file, which will be used by mongo
    ========================================================================='''
import json
import xmldict

''' =========================================================================

    Functions

    ========================================================================='''
def convert():
    '''Loads the cards.xml file, converts to JSON, and saves it'''

    #Load the cards file, make sure it exists
    try:
        cards = open('cards.xml')
    except IOError:
        print 'No cards.xml file defined! Make sure cards.xml exists'
        return False

    #Read the file
    cards = cards.read()
    
    #Convert the sucker
    cards_dict = xmldict.xml_to_dict(cards)

    #Prepare json file
    json_file = open('cards.json', 'w')

    #Get the cards
    cards = cards_dict['cockatrice_carddatabase']['cards']['card']

    #MongoDB expects the JSON file to have one document per line, so we need to
    #   iterate over each line in the file
    for card in cards:
        #Lets add some extra info to the card object
        #   Store power and toughness separately as ints
        i=0
        for type in ['power', 'toughness']:
            try:
                card[type] = card['pt'].split('/')[i]
                try:
                    #try to turn to int.  It may not be an int
                    #   (in case of X)
                    # pt is always X/Y, so split on / and use 0 index
                    # for power and 1 for toughness
                    card[type] = int(card['pt'].split('/')[i])
                except ValueError:
                    pass
            except (KeyError, IndexError) as e:
                #card has no power or toughness
                pass
            #keep track of what item we're on
            i = i+1
        
        #Also save the set name as a key so we don't have to access the set
        #   key to get the set text
        card['setText'] = card['set']['#text']

        #Save it
        json_file.write(json.dumps(card) + '\n')

    #close it
    json_file.close()

    return True


''' =========================================================================

    Init / Main

    ========================================================================='''
if __name__ == '__main__':
    #Run it!
    print "Started conversion process..."
    convert()
    print "Done! cards.json file created"
